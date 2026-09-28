# 🚀 CI/CD Lab: Fullstack NestJS + React Vite

Dự án mẫu thực hành học **CI/CD (Continuous Integration & Continuous Deployment)** từ con số 0 với **NestJS**, **React (Vite)**, **Docker**, và **GitHub Actions**.

---

## 📂 1. Cấu trúc Dự Án

```text
cicd-demo/
├── .github/workflows/
│   ├── ci.yml               # Pipeline CI (Lint, Vitest, Build, Docker Build Check)
│   └── cd.yml               # Pipeline CD (Build & Push Docker image lên GHCR, Deploy)
├── backend/                 # NestJS API
│   ├── Dockerfile           # Multi-stage build (Node 22 Alpine)
│   ├── src/                 # Code NestJS & Unit tests
│   └── vitest.config.ts     # Cấu hình test
├── frontend/                # React Vite SPA
│   ├── Dockerfile           # Multi-stage build (Node build -> Nginx Alpine)
│   ├── nginx.conf           # Web server phục vụ React SPA
│   └── src/                 # Code React & Unit tests
├── docker-compose.yml       # Chạy fullstack local bằng 1 lệnh
└── README.md
```

---

## 🧪 2. Chạy thử nghiệm ở máy Local

### Cách 1: Chạy bằng Docker Compose (Khuyên dùng)
Yêu cầu: Đã cài Docker Desktop trên máy.
```bash
# Build và khởi chạy cả Backend & Frontend
docker compose up --build
```
- **Frontend**: Mở trình duyệt tại [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3000/health](http://localhost:3000/health)

---

### Cách 2: Chạy trực tiếp bằng Node.js

**Chạy Backend (NestJS):**
```bash
cd backend
npm install --legacy-peer-deps
npm run start:dev
```
- API chạy tại: [http://localhost:3000](http://localhost:3000)
- Kiểm tra test: `npm test`
- Kiểm tra linter: `npm run lint`

**Chạy Frontend (React Vite):**
```bash
cd frontend
npm install
npm run dev
```
- Web chạy tại: [http://localhost:5173](http://localhost:5173)
- Kiểm tra test: `npm test`
- Kiểm tra linter: `npm run lint`

---

## 🤖 3. Các bước đưa lên GitHub để quan sát CI/CD

### Bước 3.1: Tạo GitHub Repository mới
1. Đăng nhập vào [GitHub](https://github.com) và tạo một repository mới (ví dụ: `cicd-demo`).
2. Ở terminal của thư mục dự án này, liên kết git remote và đẩy code lên:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/cicd-demo.git
git branch -M main
git push -u origin main
```

### Bước 3.2: Quan sát Pipeline hoạt động
1. Vào tab **Actions** trên GitHub repository của bạn.
2. Bạn sẽ thấy 2 workflows tự động chạy:
   - **Continuous Integration (CI)**:
     - `Backend Test & Build`: Cài đặt môi trường, chạy oxlint, vitest, build code NestJS.
     - `Frontend Test & Build`: Cài đặt môi trường, chạy oxlint, vitest, build code React.
     - `Docker Build Validation`: Kiểm tra build Docker image để đảm bảo không lỗi cú pháp Dockerfile.
   - **Continuous Deployment (CD)**:
     - Đóng gói Docker images và push lên **GitHub Container Registry (GHCR)** dưới dạng package `ghcr.io/<your-username>/cicd-demo-backend:latest` và `frontend:latest`.

---

## 🎯 4. Bài tập thực hành thực tế (Cực kỳ quan trọng để hiểu CI/CD)

### Bài tập 1: Cố tình làm hỏng Test để thấy CI chặn code lỗi
1. Mở file [backend/src/app.service.ts](file:///d:/Learn/3D/cicd-demo/backend/src/app.service.ts).
2. Sửa hàm `getHello()` từ `'Hello World!'` thành `'Hello Bug!'`.
3. Commit và push code lên GitHub:
   ```bash
   git commit -am "test: introduce bug"
   git push
   ```
4. Vào lại tab **Actions** trên GitHub:
   - 👉 **Kết quả:** Job `backend-ci` sẽ báo **ĐỎ (Failed)** vì Unit Test phát hiện chuỗi trả về không khớp kỳ vọng.
   - Nhờ đó, code lỗi bị chặn ngay lập tức, không thể deploy ra môi trường thật!

### Bài tập 2: Sửa lại lỗi và thấy CI/CD tự động phục hồi xanh
1. Sửa lại file [backend/src/app.service.ts](file:///d:/Learn/3D/cicd-demo/backend/src/app.service.ts) về lại `'Hello World!'` (hoặc cập nhật unit test trong [backend/src/app.controller.spec.ts](file:///d:/Learn/3D/cicd-demo/backend/src/app.controller.spec.ts)).
2. Commit và push:
   ```bash
   git commit -am "fix: resolve unit test error"
   git push
   ```
3. 👉 **Kết quả:** GitHub Actions chuyển sang màu **XANH (Success)** và tự động kích hoạt CD build & push bản vá mới!
