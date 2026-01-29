import { createContext, useState, useContext, ReactNode } from "react";

export interface UserInfo {
  id: number;
  username: string;
  password?: string; // 보안상 프론트에 저장 안 하는 게 좋지만, 기존 타입 유지
  profile_img: string | null;
  created_dt: string;
  updated_dt: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  token: string | null;
  login: (userInfo: UserInfo, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. 초기값 설정 시 localStorage 확인 (새로고침 시 복구용)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (userData: UserInfo, authToken: string) => {
    // 2. 상태 업데이트 (앱 내 반영)
    setUserInfo(userData);
    setToken(authToken);

    // 3. localStorage에 저장 (브라우저 저장소에 영구 보관)
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    // 4. 상태 초기화
    setUserInfo(null);
    setToken(null);

    // 5. localStorage 삭제 (로그아웃 시 흔적 제거)
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ userInfo, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
