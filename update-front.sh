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
sudo -u $1 yarn install
sudo -u $1 NODE_ENV=production node_modules/.bin/webpack


php artisan up
