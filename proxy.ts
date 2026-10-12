import { auth } from "./auth"
import { NextResponse } from "next/server"

// Middleware para proteger as rotas
export default auth((req) => {
  const isAuth = !!req.auth
  const url = req.nextUrl
  const perfil = req.auth?.user?.perfil
  
  const isLoginPage = url.pathname === "/login"
  const isTotemPage = url.pathname.startsWith("/totem")
  const isPublicApi = url.pathname.startsWith("/api/qrcode") || url.pathname.startsWith("/api/auth") || url.pathname.startsWith("/api/health") || url.pathname.startsWith("/api/restaurantes") || url.pathname.startsWith("/api/pedidos")
  const isStaticAsset = url.pathname.startsWith("/images") || url.pathname.startsWith("/favicon.ico") || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname)

  // Libera assets estáticos imediatamente
  if (isStaticAsset) {
    return NextResponse.next()
  }

  // Redireciona não autenticados para login
  if (!isAuth && !isLoginPage && !isTotemPage && !isPublicApi && url.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Regras de RBAC por perfil quando autenticado:
  if (isAuth) {
    // Redireciona perfis para sua tela principal ao tentar acessar /login
    if (isLoginPage) {
      if (perfil === "DEV") return NextResponse.redirect(new URL("/dev", req.url))
      if (perfil === "ADM") return NextResponse.redirect(new URL("/adm", req.url))
      if (perfil === "COZINHA") return NextResponse.redirect(new URL("/cozinha", req.url))
      if (perfil === "ATENDENTE") return NextResponse.redirect(new URL("/atendente", req.url))
      return NextResponse.redirect(new URL("/", req.url))
    }

    // ADM e DEV têm trânsito livre
    if (perfil === "ADM" || perfil === "DEV") {
      return NextResponse.next()
    }

    // ATENDENTE só pode acessar sua área (bloqueado de /adm e /cozinha)
    if (perfil === "ATENDENTE" && (url.pathname.startsWith("/adm") || url.pathname.startsWith("/cozinha"))) {
      return NextResponse.redirect(new URL("/atendente", req.url))
    }

    // COZINHA só pode acessar sua área (bloqueado de /adm)
    if (perfil === "COZINHA" && url.pathname.startsWith("/adm")) {
      return NextResponse.redirect(new URL("/cozinha", req.url))
    }
  }
})

// Aplica o middleware apenas nas rotas necessárias
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
