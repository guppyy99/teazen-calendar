import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#FF6B6B"/>
            <path d="M12 7L7 9.5V14.5L12 17L17 14.5V9.5L12 7Z" fill="#FFF"/>
          </svg>
          <h1>TEAZEN 혈당 캘린더</h1>
        </div>
      </div>
    </header>
  )
}

export default Header

