const buildPasswordResetEmail = ({ name, resetUrl }) => `
<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:560px;background:#ffffff;border-radius:12px;padding:40px;">
            <tr>
              <td>
                <h1 style="margin:0 0 24px;color:#2563eb;">
                  DiviSmart
                </h1>

                <h2 style="margin:0 0 16px;">
                  Redefinição de senha
                </h2>

                <p>
                  Olá, ${name || "usuário"}.
                </p>

                <p>
                  Recebemos uma solicitação para redefinir a senha da sua conta.
                </p>

                <p style="margin:32px 0;">
                  <a href="${resetUrl}"
                    style="display:inline-block;background:#2563eb;color:#ffffff;
                    text-decoration:none;padding:14px 24px;border-radius:8px;
                    font-weight:bold;">
                    Redefinir minha senha
                  </a>
                </p>

                <p>
                  Este link será válido por 1 hora e poderá ser usado apenas uma vez.
                </p>

                <p>
                  Se você não solicitou esta alteração, ignore este e-mail.
                </p>

                <hr style="border:0;border-top:1px solid #e2e8f0;margin:32px 0;">

                <p style="font-size:12px;color:#64748b;">
                  Caso o botão não funcione, copie este endereço:
                </p>

                <p style="font-size:12px;word-break:break-all;color:#64748b;">
                  ${resetUrl}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export default buildPasswordResetEmail;