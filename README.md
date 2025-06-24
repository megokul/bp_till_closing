# bp-till-cashup

`bp-till-cashup` is a lightweight web application designed to help petrol station staff efficiently calculate till cash totals at the end of the day. It allows users to enter note counts and coin weights (for UK denominations), set float amounts, and calculate safe drop amounts for secure storage.

---

## 🚀 Features

- Input note counts (£50, £20, £10, £5)
- Input coin weights (1p to £2 coins)
- Automatic calculation of total cash
- Float amount deduction
- Safe drop amount calculation
- Responsive design for desktop and mobile use

---

## 💻 Tech Stack

- **HTML**
- **CSS**
- **JavaScript**
- Hosted via **AWS S3 Static Website Hosting**

---

## 📦 Project Structure
bp-till-cashup/
├── index.html # Main app page
├── style.css # App styling
└── script.js # App logic



---

## 🌐 Hosting

This application is hosted on AWS S3.  
👉 **Website URL:**  
[http://YOUR-S3-ENDPOINT](http://YOUR-S3-ENDPOINT)

*(Replace with your actual S3 static website endpoint URL)*

---

## ⚙️ Usage

1️⃣ Enter the count of each note denomination.  
2️⃣ Enter the weight of each coin denomination (in grams).  
3️⃣ Set the float amount (default £150).  
4️⃣ View the calculated:
- Total till cash
- Safe drop cash (amount to be secured)

---

## 📝 Example

| Denomination | Input Example |
|--------------|--------------|
| £50 notes    | 2            |
| £20 notes    | 5            |
| £10 notes    | 10           |
| £5 notes     | 8            |
| 1p coins     | 257.56 g     |
| £1 coins     | 345.00 g     |

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Author

Built by **Gokul K.**  
