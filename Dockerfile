FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY main.js /usr/share/nginx/html/main.js
EXPOSE 80
