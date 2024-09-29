
const emailTemplate = `
<!DOCTYPE html>
<html lang="he">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700&display=swap");

      body {
        font-family: "Noto Sans Hebrew", sans-serif;
        background-color: #f5f5f5;
        color: #333;
        direction: rtl !important;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
      }

      .header-logo {
        width: 100%;
        background-color: #000;
        padding: 40px 0;
        text-align: center;
      }

      .header-logo img {
        max-width: 200px;
        height: auto;
      }

      .wrapper {
        background-color: #fff;
        border-radius: 10px;
        width: 90%;
        max-width: 800px;
        margin: 20px auto;
        padding: 30px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
      }

      .container {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
      }

      .content {
        margin-top: 30px;
        text-align: center;
        color: #333;
      }

      .cta-button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4caf50;
        color: white !important;
        text-decoration: none !important;
        border-radius: 30px;
        margin-top: 20px;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.3s;
      }

      .cta-button:hover {
        background-color: #3e8e41;
      }

      .coupon {
        margin-top: 40px;
        padding: 20px;
        background-color: #f9f9f9;
        border: 2px solid #4caf50;
        border-radius: 10px;
        color: #4caf50;
        font-size: 22px;
        font-weight: bold;
      }

      .product-card {
        background-color: #e8e8e8;
        padding: 25px;
        border-radius: 15px;
        display: inline-block;
        text-align: center;
        margin-top: 30px;
        transition: transform 0.3s;
      }

      .product-card:hover {
        transform: scale(1.05);
      }

      .product-image {
        width: 100%;
        max-width: 220px;
        height: auto;
        margin: 0 auto;
      }

      .product-details {
        margin-top: 15px;
        color: #333;
      }

      .footer {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 40px 20px;
        margin-top: 50px;
        border-top: 2px solid #4caf50;
        font-size: 16px;
      }

      .Footer-logo {
        width: 80px;
        margin: 0 auto 20px auto;
        display: block;
      }

      .footer p {
        font-size: 18px;
        margin-top: 20px;
        color: #f9f9f9;
      }

      .social-links {
        margin: 20px 0;
      }

      .social-links i {
        font-size: 40px;
        margin: 0 15px;
        color: #fff;
        opacity: 0.8;
        transition: opacity 0.3s, transform 0.3s;
      }

      .social-links i:hover {
        opacity: 1;
        transform: scale(1.1);
      }

      .footer-bottom {
        font-size: 14px;
        color: #bbb;
        margin-top: 30px;
      }

      .footer-bottom a {
        color: #4caf50;
        text-decoration: none;
      }

      .footer-bottom a:hover {
        text-decoration: underline;
      }

      .footer-bottom a:nth-child(3) {
        color: #ff4c4c;
      }
    </style>
  </head>
  <body>
    <!-- Full-width black background for logo -->

    <!-- Main content -->
    <div class="wrapper">
      <div class="header-logo">
        <img src="cid:logo" alt="Logo" />
      </div>

      <div class="container">
        <div class="content">
          <h1>שלום וברוך הבא!</h1>
          <p>
            אנחנו נרגשים לקבל את פניך לקהילה שלנו, היכן שכל דגם הוא אייקון וכל
            חובב הוא חלק ממשפחה גדולה ונלהבת.
          </p>
          <img src="cid:collection" alt="אוסף רכבים" class="product-image" />
          <br />
          <a href="https://www.replicar.co.il" class="cta-button">מעבר לאתר</a>
          <br />

          <div class="coupon">
            השתמש בקוד הקופון <strong>DIECAST10</strong> וקבל 10% הנחה על הרכישה
            הבאה שלך!
          </div>

          <h3>תכירו את המוצר הכי נמכר אצלנו</h3>
          <div class="product-card">
            <img src="cid:product" alt="מוצר ספיתיפי" class="product-image" />
            <div class="product-details">
              <div class="product-name">911 GT3</div>
              <div class="product-brand">Porsche</div>
              <div class="product-price">₪349.99</div>
              <div class="product-size">גודל: 1:24</div>
              <a
                href="https://replicar.co.il/product-details/669eebe5e274d39b93534541"
                class="cta-button"
                >מעבר למוצר</a
              >
            </div>
          </div>
        </div>

        <div class="footer">
          <p>תרצו משהו? דברו איתנו</p>

          <div class="social-links">
            <a
              href="https://www.instagram.com/repli.car/"
              aria-label="Instagram"
            >
              <i class="fab fa-instagram"></i>
            </a>
            <a href="mailto:Repli.car911@gmail.com" aria-label="Email">
              <i class="fas fa-envelope"></i>
            </a>
          </div>

          <div class="footer-bottom">
            <p>&copy; 2024 RepliCar. כל הזכויות שמורות.</p>
            <p>
              <a href="https://www.replicar.co.il/terms">תנאי שימוש</a> |
              <a href="https://www.replicar.co.il/privacy">מדיניות פרטיות</a>
            </p>
            <p>
              <a
                href="https://www.replicar.co.il/unsubscribe"
                style="color: #ff4c4c"
                >ביטול הרשמה</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

module.exports = emailTemplate;
