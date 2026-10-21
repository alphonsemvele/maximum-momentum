#!/usr/bin/env bash
# Uploads the built app to the FTP server with lftp, which retries when the
# host drops a connection (shared hosting does, under many small transfers).
#
# - Tracked files: only those changed since the commit recorded on the
#   server in .deployed-commit (everything on the first run).
# - vendor/ and public/build/: mirrored, re-sending files whose size changed.
#
# Env: FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, FTP_SERVER_DIR (ends with "/").
set -euo pipefail

DIR="${FTP_SERVER_DIR%/}"
SETTINGS="set cmd:fail-exit yes; set ftp:ssl-force true; set ftp:ssl-protect-data true;
set net:max-retries 8; set net:reconnect-interval-base 5; set net:reconnect-interval-max 60;
set net:timeout 45; set net:persist-retries 8; set mirror:parallel-transfer-count 2"

ftp() {
    lftp -u "$FTP_USERNAME,$FTP_PASSWORD" "ftp://$FTP_SERVER" -e "$SETTINGS; $1; bye"
}

# Files that exist in the repository but are not needed on the server.
is_excluded() {
    case "$1" in
        .github/*|resources/js/*|resources/css/*|tests/*|scripts/*|storage/*) return 0 ;;
        .gitignore|*/.gitignore|.gitattributes|.editorconfig|.env.example) return 0 ;;
        *.md|package.json|package-lock.json|tsconfig.json|vite.config.ts|phpunit.xml|.npmrc) return 0 ;;
    esac
    return 1
}

previous=$(lftp -u "$FTP_USERNAME,$FTP_PASSWORD" "ftp://$FTP_SERVER" \
    -e "$SETTINGS; set cmd:fail-exit no; cat $DIR/.deployed-commit; bye" 2>/dev/null | tr -d '[:space:]' || true)

if [[ -n "$previous" ]] && git cat-file -e "$previous^{commit}" 2>/dev/null; then
    echo "Dernier déploiement : $previous → envoi des fichiers modifiés depuis."
    changed=$(git diff --name-only --diff-filter=ACMRT "$previous" HEAD)
    deleted=$(git diff --name-only --diff-filter=D "$previous" HEAD)
else
    echo "Premier déploiement : envoi de tous les fichiers suivis."
    changed=$(git ls-files)
    deleted=""
fi

script=$(mktemp)
declare -A made_dirs=()

while IFS= read -r file; do
    [[ -z "$file" || ! -f "$file" ]] && continue
    is_excluded "$file" && continue
    parent=$(dirname "$file")
    if [[ "$parent" != "." && -z "${made_dirs[$parent]:-}" ]]; then
        echo "mkdir -p -f \"$DIR/$parent\"" >> "$script"
        made_dirs[$parent]=1
    fi
    echo "put \"$file\" -o \"$DIR/$file\"" >> "$script"
done <<< "$changed"

while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    is_excluded "$file" && continue
    echo "rm -f \"$DIR/$file\"" >> "$script"
done <<< "$deleted"

echo "Fichiers suivis à envoyer : $(grep -c '^put ' "$script" || true), à supprimer : $(grep -c '^rm ' "$script" || true)"

# Built output: size-based comparison, since CI timestamps are always new.
cat >> "$script" <<LFTP
mirror -R --ignore-time --delete --no-perms --verbose=1 vendor "$DIR/vendor"
mirror -R --ignore-time --delete --no-perms --verbose=1 public/build "$DIR/public/build"
LFTP

ftp "source $script"

git rev-parse HEAD > .deployed-commit
ftp "put .deployed-commit -o $DIR/.deployed-commit"
echo "Déployé : $(cat .deployed-commit)"
