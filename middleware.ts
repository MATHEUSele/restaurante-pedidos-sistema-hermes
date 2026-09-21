import { auth } from "./auth"
import { NextResponse } from "next/server"

// Middleware para proteger as rotas
export default auth((req) => {
  const isAuth = !!req.auth
  const url = req.nextUrl
  
  const isLoginPage = url.pathname === "/login"
  const isTotemPage = url.pathname.startsWith("/totem")
  const isPublicApi = url.pathname.startsWith("/api/qrcode/validar") || url.pathname.startsWith("/api/auth")
  
  if (!isAuth && !isLoginPage && !isTotemPage && !isPublicApi && url.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Redirecionamento por perfil
  if (isAuth && isLoginPage) {
    const perfil = req.auth?.user?.perfil
    if (perfil === "DEV") return NextResponse.redirect(new URL("/dev", req.url))
    if (perfil === "ADM") return NextResponse.redirect(new URL("/adm", req.url))
    if (perfil === "COZINHA") return NextResponse.redirect(new URL("/cozinha", req.url))
    return NextResponse.redirect(new URL("/", req.url))
  }
})

// Aplica o middleware apenas nas rotas necessárias
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
