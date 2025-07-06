package com.example.AuthLinsoft.Services;

import com.example.AuthLinsoft.Entities.EmailTemplateName;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;


@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService  {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;


@Async
public void sendEmail(String to, String username, String password, EmailTemplateName emailTemplate, String confirmationUrl, String activationCode, String subject) throws MessagingException {
    String templateName = emailTemplate != null ? emailTemplate.name() : "confirm-email";
    MimeMessage mimeMessage = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MULTIPART_MODE_MIXED, UTF_8.name());

    Map<String, Object> properties = new HashMap<>();
    properties.put("username", username);
    properties.put("password", password);
    properties.put("confirmationUrl", confirmationUrl);
    properties.put("activation_code", activationCode);

    Context context = new Context();
    context.setVariables(properties);

    helper.setFrom("rhlinsoft@gmail.com");
    helper.setTo(to);
    helper.setSubject(subject);

    String template = templateEngine.process(templateName, context);
    helper.setText(template, true);

    mailSender.send(mimeMessage);
}
}
