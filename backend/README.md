# Como gerar DOCS do swagger?

```bash
sudo docker exec -it backend_container bash
```
```bash
root@a481d18b79ec:/var/www/api.intellecta# ./vendor/bin/openapi src/App/Docs -o public/swagger.json
```
|Caso um diretório for criado, ao invés de um arquivo JSON, delete o diretório e re-execute o comando para criar o arquivo
