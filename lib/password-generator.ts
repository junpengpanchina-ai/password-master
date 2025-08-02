export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    excludeAmbiguous,
  } = options;

  let charset = '';

  if (includeUppercase) {
    charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (includeLowercase) {
    charset += excludeSimilar ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }
  if (includeNumbers) {
    charset += excludeAmbiguous ? '23456789' : '0123456789';
  }
  if (includeSymbols) {
    charset += excludeAmbiguous ? '!@#$%^&*' : '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }

  if (charset === '') {
    return '请至少选择一种字符类型';
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  // 长度评分
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // 字符类型评分
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // 复杂度评分
  if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    score += 1;
  }
  
  const maxScore = 8;
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) {
    return { score: percentage, label: '非常强', color: 'bg-green-500' };
  } else if (percentage >= 60) {
    return { score: percentage, label: '强', color: 'bg-blue-500' };
  } else if (percentage >= 40) {
    return { score: percentage, label: '中等', color: 'bg-yellow-500' };
  } else if (percentage >= 20) {
    return { score: percentage, label: '弱', color: 'bg-orange-500' };
  } else {
    return { score: percentage, label: '很弱', color: 'bg-red-500' };
  }
} 