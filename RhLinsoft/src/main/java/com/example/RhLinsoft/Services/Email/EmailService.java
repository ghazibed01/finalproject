package com.example.RhLinsoft.Services.Email;
import jakarta.mail.Message;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.MessagingException;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;


@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;


//@Async
//public void sendEmail(String to, String username, String password, EmailTemplateName emailTemplate, String confirmationUrl, String activationCode, String subject) throws MessagingException {
//    String templateName = emailTemplate != null ? emailTemplate.name() : "confirm-email";
//    MimeMessage mimeMessage = mailSender.createMimeMessage();
//    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MULTIPART_MODE_MIXED, UTF_8.name());
//
//    Map<String, Object> properties = new HashMap<>();
//    properties.put("username", username);
//    properties.put("password", password);
//    properties.put("confirmationUrl", confirmationUrl);
//    properties.put("activation_code", activationCode);
//
//    Context context = new Context();
//    context.setVariables(properties);
//
//    helper.setFrom("rhlinsoft@gmail.com");
//    helper.setTo(to);
//    helper.setSubject(subject);
//
//    String template = templateEngine.process(templateName, context);
//    helper.setText(template, true);
//
//    mailSender.send(mimeMessage);
//}
@Async
public void sendEmail(
        String to,
        String username,
        String startDate,
        String endDate,
        String status,
        String leaveType,
        String comments,
        String subject
) throws MessagingException {

    String templateName = "leave-status"; // nom du template (par ex. leave-status.html dans resources/templates)
    MimeMessage mimeMessage = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MULTIPART_MODE_MIXED, UTF_8.name());

    // Préparer les variables pour le template
    Map<String, Object> properties = new HashMap<>();
    properties.put("username", username);
    properties.put("startDate", startDate);
    properties.put("endDate", endDate);
    properties.put("status", status);
    properties.put("leaveType", leaveType);
    properties.put("comments", comments != null ? comments : "Aucun commentaire");

    // Créer le contexte Thymeleaf et y injecter les variables
    Context context = new Context();
    context.setVariables(properties);

    // Configurer l'e-mail
    helper.setFrom("rhlinsoft@gmail.com");
    helper.setTo(to);
    helper.setSubject(subject);

    // Générer le contenu HTML de l'e-mail
    String template = templateEngine.process(templateName, context);
    helper.setText(template, true);

    // Envoyer l'e-mail
    mailSender.send(mimeMessage);
}
    public void sendTicketSummaryEmail(String to, String username, int ticketCount, YearMonth month) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("ticketCount", ticketCount);
        context.setVariable("month", month.getMonth().getDisplayName(TextStyle.FULL, Locale.FRENCH));
        context.setVariable("year", month.getYear());

        String body = templateEngine.process("ticket-recap", context);

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            mimeMessage.setFrom(new InternetAddress("noreply@linsoft.com"));
            mimeMessage.setSubject("Résumé des tickets repas - " + month.getMonthValue() + "/" + month.getYear());
            mimeMessage.setContent(body, "text/html; charset=UTF-8");
        };

        mailSender.send(messagePreparator);
    }
}
