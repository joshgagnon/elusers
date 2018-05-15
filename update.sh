if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <server-username>"
    exit 1
fi

if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root"
    exit 1
fi

php artisan down

sudo -u $1 git pull
rm -f vendor/compiled.php
sudo -u $1 composer update
sudo -u $1 rm yarn.lock
sudo -u $1 yarn install
sudo -u $1 php artisan clear-compiled
sudo -u $1 composer dump-autoload
sudo -u $1 NODE_ENV=production node_modules/.bin/webpack
sudo -u $1 php artisan migrate --force
sudo -u $1 php artisan db:update-functions
sudo -u $1 php artisan optimize

php artisan up
