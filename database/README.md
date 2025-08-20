## Mudanças no esquema da base de dados
Mudanças no esquema de base de dados requerem que o diretório '/volumes' seja excluído para que as alterações sejam refletidas no banco de dados. Execute o comando abaixo para tal:

```bash
sudo rm -rf ./volumes
```

## Tipos de Evento
| Código           | Descrição                             |
| ---------------- | ------------------------------------- |
| `class`          | Aula (presencial ou online)           |
| `exam`           | Prova ou avaliação escrita            |
| `quiz`           | Teste rápido                          |
| `assignment`     | Entrega de atividade                  |
| `lecture`        | Palestra                              |
| `workshop`       | Oficina prática                       |
| `seminar`        | Seminário                             |
| `presentation`   | Apresentação de trabalho              |
| `deadline`       | Prazo final (para qualquer entrega)   |
| `holiday`        | Feriado                               |
| `announcement`   | Aviso ou comunicado importante        |
| `cultural`       | Evento cultural (ex: feira literária) |
| `sports`         | Evento esportivo                      |
| `other`          | Outro tipo não especificado           |
