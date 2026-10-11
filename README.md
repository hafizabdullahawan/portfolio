# Abdullah Idrees portfolio

Static site (HTML, CSS, JS). Contact form uses Web3Forms (no server needed): put your access key in contact.html (YOUR_WEB3FORMS_ACCESS_KEY).

## Deploy
1. Upload everything to `public_html` (include the hidden `.htaccess` files).
2. In `api/`, copy `config.sample.php` to `config.php` and fill in your SMTP details
   (cPanel mailbox, or Gmail with an App Password). Port 465 = SSL, 587 = STARTTLS.
3. Open the site, send yourself a test message from the Contact page.
4. If your real domain is not `www.abdullahidrees.com`, search and replace that domain in
   all `.html` files, `sitemap.xml`, `robots.txt`, `llms.txt` and `.htaccess`.
5. Submit `https://YOURDOMAIN/sitemap.xml` in Google Search Console.

## Notes
- Requires PHP 7.4+ only for the contact form. Without PHP the form shows an email fallback.
- `projects/pharmacy-management.svg` and `linked-list-address-book.svg` are illustrations.
  Replace them with real screenshots (same file names, or update `projects/*.html`).
