import jwt_decode from 'jwt-decode';

// Kiểm tra token hết hạn
export function isTokenExpired(token) {
  const decodedToken = jwt_decode(token); // Giải mã token 
  const expirationTime = decodedToken.exp * 1000; // Chuyển đổi sang milliseconds
  const currentTime = Date.now();
  return expirationTime < currentTime;
}

// Lấy token từ localStorage và kiểm tra tính hợp lệ
export function checkTokenValidity() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return null; // Trả về null nếu không tìm thấy token
  }

  // Kiểm tra token có hết hạn không
  const expired = isTokenExpired(token);

  if (expired) {
    localStorage.removeItem('jwt_token'); // Xóa token nếu hết hạn
    window.location.href = '/login';     // Chuyển hướng đến trang login
    return null;
  }

  return token;
}


// Giải mã token để lấy thông tin người dùng
export function decodeToken() {
  const token = checkTokenValidity(); // Lấy token hợp lệ
  if (token) {
    try {
      const decoded = jwt_decode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error); // Nếu có lỗi, log ra lỗi
    }
  }
  return null; // Trả về null nếu token không hợp lệ
}

// Lấy vai trò (role) của người dùng từ token
export function getUserRole() {
  const decodedToken = decodeToken(); // Lấy token đã giải mã
  return decodedToken ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null; // Trả về vai trò nếu có
}

// Lấy ID của người dùng từ token
export function getUserId() {
  const decodedToken = decodeToken(); // Lấy token đã giải mã
  return decodedToken ? decodedToken.id : null; // Trả về ID nếu có
}
