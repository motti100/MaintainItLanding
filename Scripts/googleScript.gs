function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('1DpkRXcPLC2qlZkISAFJttMz4OIQymoG6V8g4EFsPWlc').getActiveSheet();
    
    // Get form data
    var firstName = e.parameter.firstName || '';
    var lastName = e.parameter.lastName || '';
    var email = e.parameter.email;
    var timestamp = new Date();
    var source = e.parameter.source || 'main-form';
    
    // Get tracking data from client
    var userAgent = e.parameter.userAgent || 'Unknown';
    var screenResolution = e.parameter.screenResolution || 'Unknown';
    var timezone = e.parameter.timezone || 'Unknown';
    var language = e.parameter.language || 'Unknown';
    var referrer = e.parameter.referrer || 'Unknown';
    
    // Get IP from client OR try to get from server
    var ipAddress = e.parameter.ipAddress;
    
    if (!ipAddress || ipAddress === 'Unknown') {
      try {
        ipAddress = e.headers['X-Forwarded-For'] || 
                   e.headers['x-forwarded-for'] || 
                   'Unknown';
        
        if (ipAddress && ipAddress !== 'Unknown') {
          ipAddress = ipAddress.split(',')[0].trim();
        }
      } catch (err) {
        ipAddress = 'Unknown';
      }
    }
    
    Logger.log('Saving data - Name: ' + firstName + ' ' + lastName + ', Email: ' + email + ', Source: ' + source);
    
    // Save to sheet WITH FIRST AND LAST NAME
    sheet.appendRow([
      timestamp,
      firstName,
      lastName,
      email,
      source,
      ipAddress,
      userAgent,
      screenResolution,
      timezone,
      language,
      referrer
    ]);
    
    // Send DIFFERENT emails based on source
    if (source === 'hero-form') {
      sendWelcomeEmail(firstName, lastName, email, source);
      Logger.log('✅ Hero form saved + welcome email sent: ' + email);
    } else if (source === 'exit-popup') {
      sendChecklistLink(firstName, lastName, email, source);
      Logger.log('✅ Checklist link sent to: ' + email);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    Logger.log('❌ Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// WELCOME EMAIL for hero form signups - WITH PERSONALIZATION
function sendWelcomeEmail(firstName, lastName, email, source) {
  var subject = "You're on the List! Maintain-It Early Access";
  var senderName = "Martin - Maintain-It";
  
  // Personalize greeting
  var greeting = firstName ? ("Hi " + firstName + "!") : "Hi there!";
  
  var plainBody = greeting + "\n\n" +
    "Thanks for signing up for early access to Maintain-It!\n\n" +
    "You have been added to our exclusive waitlist. We will email you the moment the app launches (which is very soon!).\n\n" +
    "WHAT IS MAINTAIN-IT?\n" +
    "Maintain-It is the easiest way to track maintenance for your cars, home, and properties:\n\n" +
    "- 30-second vehicle setup with VIN scanning\n" +
    "- Smart automatic reminders\n" +
    "- Track everything in one place\n" +
    "- Privacy-first - data stays on your device\n" +
    "- Never miss oil changes, tire rotations, or inspections again\n\n" +
    "WHY YOU WILL LOVE IT:\n" +
    "- Save $1,500-8,000 annually on repairs by staying on schedule\n" +
    "- Increase your car resale value by 15% with documented maintenance\n" +
    "- Stop forgetting important home tasks like HVAC filter changes\n" +
    "- One app for cars, home, appliances, and properties\n\n" +
    "WHILE YOU WAIT:\n" +
    "Want a free Ultimate Maintenance Checklist?\n" +
    "Download here: https://drive.google.com/uc?export=download&id=12URFCHImubgR-EnVhqSMv2pQRBWOQhLK\n\n" +
    "We will notify you the moment Maintain-It launches. You will be among the first to try it!\n\n" +
    "Best regards,\n" +
    "Martin Tobias\n" +
    "Creator of Maintain-It\n" +
    "Maintain-It.help@hotmail.com\n\n" +
    "P.S. Early access users get 30 days free instead of 14. We will send you a special code when we launch!\n\n" +
    "---\n" +
    "Website: https://themaintainit.app\n" +
    "Support: https://sites.google.com/view/maintainit-app-help/support";

  var htmlBody = '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<style>' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 0; background: #F8FAFC; }' +
    '.email-container { background: #FFFFFF; border-radius: 12px; overflow: hidden; margin: 20px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }' +
    '.header { background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%); color: white; padding: 40px 30px; text-align: center; }' +
    '.header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; color: #1E293B; }' +
    '.header p { margin: 0; font-size: 18px; opacity: 0.95; color: #1E293B; }' +
    '.content { padding: 40px 30px; }' +
    '.content p { font-size: 16px; margin: 0 0 20px 0; }' +
    '.waitlist-box { background: #F0F9FF; border: 2px solid #3B82F6; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }' +
    '.waitlist-box h2 { margin: 0 0 15px 0; color: #1E40AF; font-size: 24px; }' +
    '.waitlist-box p { margin: 0; color: #475569; }' +
    '.features { margin: 30px 0; }' +
    '.features h3 { font-size: 20px; margin: 0 0 15px 0; color: #1E293B; }' +
    '.feature-list { list-style: none; padding: 0; margin: 0; }' +
    '.feature-list li { padding: 12px 0 12px 35px; position: relative; font-size: 16px; }' +
    '.feature-list li:before { content: "\\2713"; position: absolute; left: 0; color: #10B981; font-weight: bold; font-size: 20px; }' +
    '.benefits-box { background: #F8FAFC; border-left: 4px solid #10B981; padding: 25px; margin: 30px 0; border-radius: 8px; }' +
    '.benefits-box h3 { margin: 0 0 15px 0; color: #059669; font-size: 20px; }' +
    '.benefits-box ul { margin: 0; padding-left: 25px; }' +
    '.benefits-box li { margin: 10px 0; color: #475569; }' +
    '.bonus-box { background: #FFF9E6; border: 2px solid #F59E0B; border-radius: 10px; padding: 25px; margin: 30px 0; text-align: center; }' +
    '.bonus-box h3 { margin: 0 0 10px 0; color: #D97706; font-size: 20px; }' +
    '.bonus-box p { margin: 0 0 15px 0; }' +
    '.bonus-box a { display: inline-block; background: #F59E0B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }' +
    '.signature { margin: 40px 0 0 0; padding: 25px 0 0 0; border-top: 1px solid #E2E8F0; }' +
    '.signature p { margin: 5px 0; }' +
    '.footer { background: #F8FAFC; padding: 30px; text-align: center; color: #64748B; font-size: 14px; }' +
    '.footer a { color: #3B82F6; text-decoration: none; }' +
    '@media only screen and (max-width: 600px) { .header h1 { font-size: 28px; } .content { padding: 30px 20px; } }' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="email-container">' +
    '<div class="header">' +
    '<h1>You are on the List!</h1>' +
    '<p>Welcome to Maintain-It Early Access</p>' +
    '</div>' +
    '<div class="content">' +
    '<p style="font-size: 18px; font-weight: 500;">' + greeting + '</p>' +
    '<p>Thanks for signing up for early access to Maintain-It!</p>' +
    '<div class="waitlist-box">' +
    '<h2>You have Been Added to Our Waitlist</h2>' +
    '<p>We will email you the moment the app launches. You will be among the first to try it!</p>' +
    '</div>' +
    '<div class="features">' +
    '<h3>What is Maintain-It?</h3>' +
    '<p>The easiest way to track maintenance for your cars, home, and properties:</p>' +
    '<ul class="feature-list">' +
    '<li><strong>30-Second Setup:</strong> VIN scanning configures everything automatically</li>' +
    '<li><strong>Smart Reminders:</strong> Get notified before maintenance is due</li>' +
    '<li><strong>Track Everything:</strong> Cars, home, appliances, properties - all in one place</li>' +
    '<li><strong>Privacy-First:</strong> All data stays on your device, not in the cloud</li>' +
    '<li><strong>Never Forget:</strong> Oil changes, tire rotations, inspections, and more</li>' +
    '</ul>' +
    '</div>' +
    '<div class="benefits-box">' +
    '<h3>Why You Will Love It:</h3>' +
    '<ul>' +
    '<li><strong>Save $1,500-8,000 annually</strong> on repairs by staying on schedule</li>' +
    '<li><strong>Increase resale value by 15%</strong> with documented maintenance</li>' +
    '<li><strong>Stop forgetting</strong> important home tasks like HVAC filter changes</li>' +
    '<li><strong>One app for everything</strong> - cars, home, appliances, properties</li>' +
    '</ul>' +
    '</div>' +
    '<div class="bonus-box">' +
    '<h3>While You Wait...</h3>' +
    '<p>Want a free Ultimate Maintenance Checklist?</p>' +
    '<a href="https://drive.google.com/uc?export=download&id=12URFCHImubgR-EnVhqSMv2pQRBWOQhLK" style="color: white;">Download Your Free Checklist</a>' +
    '</div>' +
    '<div class="signature">' +
    '<p style="margin: 0 0 5px 0;"><strong>Best regards,</strong></p>' +
    '<p style="margin: 0 0 5px 0;">Martin Tobias</p>' +
    '<p style="margin: 0 0 5px 0; color: #64748B;">Creator of Maintain-It</p>' +
    '<p style="margin: 0;"><a href="mailto:Maintain-It.help@hotmail.com" style="color: #3B82F6; text-decoration: none;">Maintain-It.help@hotmail.com</a></p>' +
    '</div>' +
    '<p style="font-size: 14px; color: #64748B; margin-top: 30px; font-style: italic;">' +
    '<strong>P.S.</strong> We will notify you the moment Maintain-It launches. You will be among the first to experience 30-second VIN scanning!' +
    '</p>' +
    '</div>' +
    '<div class="footer">' +
    '<p style="margin: 0 0 15px 0;">You are receiving this because you signed up for Maintain-It early access</p>' +
    '<p>' +
    '<a href="https://themaintainit.app">Website</a> | ' +
    '<a href="https://sites.google.com/view/maintainit-app-help/support">Support</a> | ' +
    '<a href="https://themaintainit.app/privacy.html">Privacy Policy</a>' +
    '</p>' +
    '<p style="margin: 15px 0 0 0; font-size: 12px;">2026 Maintain-It. All rights reserved.</p>' +
    '</div>' +
    '</div>' +
    '</body>' +
    '</html>';

  try {
    GmailApp.sendEmail(email, subject, plainBody, {
      htmlBody: htmlBody,
      name: senderName,
      replyTo: 'Maintain-It.help@hotmail.com',
      charset: 'UTF-8'
    });
    
    Logger.log('✅ Welcome email sent to: ' + firstName + ' ' + lastName + ' (' + email + ')');
    
  } catch (error) {
    Logger.log('❌ Error sending welcome email: ' + error.toString());
  }
}

// CHECKLIST EMAIL for exit popup - WITH PERSONALIZATION
function sendChecklistLink(firstName, lastName, email, source) {
  var subject = "Your Maintenance Checklist Download";
  var senderName = "Martin - Maintain-It";
  
  // Personalize greeting
  var greeting = firstName ? ("Hi " + firstName + "!") : "Hi there!";
  
  var downloadLink = 'https://drive.google.com/uc?export=download&id=12URFCHImubgR-EnVhqSMv2pQRBWOQhLK';
  
  var plainBody = greeting + "\n\n" +
    "Thanks for requesting the Ultimate Maintenance Checklist!\n\n" +
    "DOWNLOAD YOUR CHECKLIST:\n" +
    downloadLink + "\n\n" +
    "IMPORTANT: Check your spam folder if you do not see this email in your inbox.\n\n" +
    "What is inside:\n" +
    "- 47-point vehicle inspection schedule\n" +
    "- Seasonal home maintenance calendar\n" +
    "- Money-saving maintenance tips\n" +
    "- Professional schedules based on 20+ years experience\n\n" +
    "Want automatic maintenance reminders instead of paper checklists?\n" +
    "Try Maintain-It free: https://themaintainit.app\n\n" +
    "Best regards,\n" +
    "Martin Tobias\n" +
    "Creator of Maintain-It\n" +
    "Maintain-It.help@hotmail.com\n\n" +
    "---\n" +
    "Support: https://sites.google.com/view/maintainit-app-help/support";

  var htmlBody = '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
    '<style>' +
    'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }' +
    '.email-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }' +
    '.header { background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%); color: white; padding: 40px 20px; text-align: center; }' +
    '.header h1 { margin: 0; font-size: 28px; font-weight: bold; color: #1E293B; }' +
    '.content { padding: 40px 30px; }' +
    '.download-box { background: #3B82F6; padding: 30px; text-align: center; margin: 25px 0; border-radius: 12px; }' +
    '.download-box h2 { margin-top: 0; color: white; font-size: 24px; }' +
    '.download-box p { color: white; margin-bottom: 20px; }' +
    '.download-button { display: inline-block; background: white; color: #3B82F6; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 20px 0; }' +
    '.highlight { background: #FFF9E6; padding: 15px 20px; margin: 20px 0; border-left: 4px solid #F59E0B; border-radius: 4px; }' +
    '.features { background: #F8FAFC; padding: 20px; margin: 20px 0; border-radius: 8px; }' +
    '.features ul { margin: 10px 0; padding-left: 25px; }' +
    '.features li { margin: 10px 0; color: #475569; }' +
    '.cta-box { background: #F0FDF4; border: 2px solid #10B981; padding: 25px; text-align: center; margin: 30px 0; border-radius: 12px; }' +
    '.cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }' +
    '.footer { padding: 20px 30px; background: #F8FAFC; text-align: center; color: #64748B; font-size: 13px; }' +
    '.footer a { color: #3B82F6; text-decoration: none; }' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="email-container">' +
    '<div class="header">' +
    '<h1>Your Maintenance Checklist</h1>' +
    '</div>' +
    '<div class="content">' +
    '<p style="font-size: 16px;">' + greeting + '</p>' +
    '<p>Thanks for requesting the <strong>Ultimate Maintenance Checklist</strong>!</p>' +
    '<div class="download-box">' +
    '<h2 style="color: white;">Download Your Checklist</h2>' +
    '<p style="color: white;">Click the button below to download your PDF checklist</p>' +
    '<a href="' + downloadLink + '" style="display: inline-block; background: white; color: #3B82F6; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 20px 0;">Download PDF Checklist</a>' +
    '</div>' +
    '<div class="features">' +
    '<p><strong>What is Inside Your Checklist:</strong></p>' +
    '<ul>' +
    '<li><strong>47-Point Vehicle Inspection</strong> - Complete maintenance schedule</li>' +
    '<li><strong>Seasonal Home Maintenance</strong> - Never miss critical tasks</li>' +
    '<li><strong>Money-Saving Tips</strong> - Save $1,500 to $8,000 annually</li>' +
    '<li><strong>Professional Schedules</strong> - Based on 20+ years experience</li>' +
    '</ul>' +
    '</div>' +
    '<p>Paper checklists are helpful, but they do not send reminders.</p>' +
    '<div class="cta-box">' +
    '<h3 style="margin-top: 0; color: #059669;">Want Automatic Reminders?</h3>' +
    '<p style="color: #64748B;">Maintain-It is a mobile app that automatically tracks your maintenance and sends you smart reminders.</p>' +
    '<a href="https://themaintainit.app" style="display: inline-block; background: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">Try Maintain-It Free for 14 Days</a>' +
    '<p style="font-size: 13px; color: #64748B; margin-bottom: 0;">No credit card required</p>' +
    '</div>' +
    '<p style="margin-top: 40px;">' +
    '<strong>Best regards,</strong><br>' +
    'Martin Tobias<br>' +
    'Creator of Maintain-It<br>' +
    '<a href="mailto:Maintain-It.help@hotmail.com" style="color: #3B82F6;">Maintain-It.help@hotmail.com</a>' +
    '</p>' +
    '<p style="font-size: 13px; color: #64748B; margin-top: 30px;">' +
    '<strong>P.S.</strong> The checklist is yours to keep forever. But if you want to actually <em>remember</em> to complete these tasks, Maintain-It makes it effortless.' +
    '</p>' +
    '</div>' +
    '<div class="footer">' +
    '<p>You requested this checklist from Maintain-It</p>' +
    '<p>' +
    '<a href="https://themaintainit.app" style="color: #3B82F6;">Website</a> | ' +
    '<a href="https://sites.google.com/view/maintainit-app-help/support" style="color: #3B82F6;">Support</a> | ' +
    '<a href="https://themaintainit.app/privacy.html" style="color: #3B82F6;">Privacy Policy</a>' +
    '</p>' +
    '</div>' +
    '</div>' +
    '</body>' +
    '</html>';

  try {
    GmailApp.sendEmail(email, subject, plainBody, {
      htmlBody: htmlBody,
      name: senderName,
      replyTo: 'Maintain-It.help@hotmail.com',
      charset: 'UTF-8'
    });
    
    Logger.log('✅ Checklist link sent to: ' + firstName + ' ' + lastName + ' (' + email + ')');
    
  } catch (error) {
    Logger.log('❌ Error sending email: ' + error.toString());
  }
}

// TEST FUNCTIONS
function testWelcomeEmail() {
  sendWelcomeEmail('John', 'Doe', 'mtobias2000@hotmail.com', 'test');
  Logger.log('Test welcome email sent!');
}

function testChecklistEmail() {
  sendChecklistLink('John', 'Doe', 'mtobias2000@hotmail.com', 'test');
  Logger.log('Test checklist email sent!');
}