export const metadata = {
  title: 'Make It Visible · 免费在线愿景板',
  description: '无需注册，图片不上传。把照片和目标做成每天都看得见的高清愿景板。',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
