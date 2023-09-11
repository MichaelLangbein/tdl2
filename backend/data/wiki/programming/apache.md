# Apache

## Configuration

Hierarchy: 
- root-config: `/etc/apache2/apache2.conf`, valid for everything
- virtual hosts: `/etc/apache2/sites-enabled/*.conf`, valid for the domain, port and path specified 
- .htaccess: `/var/www/*/.htaccess`, valid for the directory and its children

Important settings:
- /etc/apache2/apache2.conf
    - `Directory` directives: which directories will apache2 try to access?
        - Those dirs still need to be readable (and executable?) by the apache2-user
        - includes an entry for `/var/www`, which is the directory that apache2 serves content out of per default.
    - `IncludeOptional sites-enabled/*.conf`
    - `AccessFileName .htaccess`
- sites-enabled
    - symbolic links from sites-available
    - `VirtualHost` directives
    - `port`
    - `ServerName`
    - `DocumentRoot` (/var/www/html by default)
    - `ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/`: Tells apache that a path /cgi-bin/ whould be mapped to /usr/lib/cgi-bin/ and will contain an executable, not a static file.
    - `<Directory "/usr/lib/cgi-bin/">`: Tells apache that it should try to access this directory
- .htaccess
    - 
