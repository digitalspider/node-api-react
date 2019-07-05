FROM httpd:2.4-alpine
MAINTAINER dvittor@gmail.com
WORKDIR /usr/local/apache2/htdocs/

COPY ./build/ ./

# Copy .htaccess into DocumentRoot
COPY ./etc/apache/.htaccess /usr/local/apache2/htdocs/

# Enable modules
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
# Enable .htaccess file
RUN sed -i 's/AllowOverride None/AllowOverride FileInfo/' /usr/local/apache2/conf/httpd.conf

# Add conf.d directory and include *.conf files
RUN { \
  echo 'IncludeOptional conf.d/*.conf'; \
} >> /usr/local/apache2/conf/httpd.conf \
  && mkdir /usr/local/apache2/conf.d
