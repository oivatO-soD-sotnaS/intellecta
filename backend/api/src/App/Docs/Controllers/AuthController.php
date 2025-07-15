<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Autenticação", description: "Operações relacionadas a autenticação de usuários")]
class AuthController {
  #[OA\Post(
      path: "/auth/sign-up",
      tags: ["Autenticação"],
      summary: "Registrar novo usuário",
      description: "Cria uma nova conta de usuário não verificada e envia um código de verificação por e-mail",
      operationId: "signUp",
      requestBody: new OA\RequestBody(
          required: true,
          description: "Dados do usuário para registro",
          content: new OA\JsonContent(ref: "#/components/schemas/SignUpRequest")
      ),
      responses: [
          new OA\Response(
              response: 201,
              description: "Conta criada com sucesso",
              content: new OA\JsonContent(ref: "#/components/schemas/SignUpResponse")
          ),
          new OA\Response(
              response: 422,
              description: "Dados inválidos ou faltando",
              content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
          ),
          new OA\Response(
              response: 409,
              description: "E-mail já registrado",
              content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
          ),
          new OA\Response(
              response: 500,
              description: "Erro interno do servidor",
              content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
          )
      ]
  )]
  public function signUp() {}

  #[OA\Post(
        path: "/auth/verify-code",
        tags: ["Autenticação"],
        summary: "Verificar e-mail do usuário",
        description: "Verifica o código de verificação enviado por e-mail e ativa a conta do usuário",
        operationId: "verifyEmail",
        requestBody: new OA\RequestBody(
            required: true,
            description: "E-mail e código de verificação",
            content: new OA\JsonContent(ref: "#/components/schemas/VerifyEmailRequest")
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "E-mail verificado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/VerifyEmailResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 422,
                description: "Código inválido ou expirado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function verifyEmail() {}

  #[OA\Post(
        path: "/auth/sign-in",
        tags: ["Autenticação"],
        summary: "Autenticar usuário",
        description: "Autentica um usuário com e-mail e senha, retornando um token JWT",
        operationId: "signIn",
        requestBody: new OA\RequestBody(
            required: true,
            description: "Credenciais do usuário",
            content: new OA\JsonContent(ref: "#/components/schemas/SignInRequest")
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Autenticação bem-sucedida",
                content: new OA\JsonContent(ref: "#/components/schemas/AuthResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Credenciais inválidas",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 403,
                description: "E-mail não verificado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function signIn() {}

  #[OA\Post(
        path: "/auth/sign-out",
        tags: ["Autenticação"],
        summary: "Desautenticar usuário",
        description: "Invalida o token JWT do usuário, efetuando logout",
        operationId: "signOut",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Logout bem-sucedido",
                content: new OA\JsonContent(ref: "#/components/schemas/SignOutResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Token inválido ou não fornecido",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
  )]
  public function signOut() {}
}