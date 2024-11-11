# ใช้ Node.js image ที่เป็นฐาน
FROM node:14

# กำหนด directory สำหรับแอปพลิเคชัน
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ package-lock.json (ถ้ามี)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์แอปพลิเคชันทั้งหมด
COPY . .

# เปิดพอร์ตที่ต้องใช้
EXPOSE 3000

# คำสั่งสำหรับรันแอปพลิเคชัน
CMD ["node", "server.js"]
