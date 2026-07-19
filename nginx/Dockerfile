FROM nginx:1.28-alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget -q --spider http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
