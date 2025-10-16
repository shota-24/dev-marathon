    #!/usr/bin/env bash
    # mask_company_db.sh
    # company_name を * にマスキング（cron用、ロックなし、パスワード直接指定）

    set -euo pipefail

    DB_NAME="db_shota_nishinaga"
    DB_USER="user_shota_nishinaga"
    DB_HOST="localhost"
    DB_PORT="5432"
    DB_PASS="5Rw5YDaWc5jc"

    # PATH指定（cron環境用）
    # export PATH=/usr/local/bin:/usr/bin:/bin
    export PGPASSWORD="$DB_PASS"

    # SQLを直接 psql コマンドで実行
    psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" -p "$DB_PORT" <<SQL
    BEGIN;
    UPDATE customer
    SET company_name = repeat('*', char_length(company_name))
    WHERE company_name IS NOT NULL;
    COMMIT;
    SQL

    echo "$(date '+%Y-%m-%d %H:%M:%S') マスキング完了しました。"
