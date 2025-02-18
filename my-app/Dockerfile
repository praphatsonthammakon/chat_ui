# ใช้ Node.js เป็น base image
FROM node:18

# ตั้ง working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json ไปยัง container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดของโปรเจคไปยัง container
COPY . .

# Build ไฟล์โปรเจค (สำหรับการ deploy)
RUN npm run build

# ใช้ serve เพื่อนำ build มาให้บริการ
RUN npm install -g serve

# เปิด port 3000 สำหรับ production server
EXPOSE 3000

# รันแอปพลิเคชันด้วย serve
CMD ["serve", "-s", "dist", "-l", "3000"]
