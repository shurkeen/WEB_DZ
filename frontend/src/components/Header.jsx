export default function Header() {
    return (
        <header className="header-block">
            <div className="header-block-left-part">
                <img src="/images/logo.svg" alt="Logo" />
                <span className="header-block-left-part-text">онлайн-сервис для размещения
                наружной рекламы в 59 городах России</span>
            </div>
            <div className="header-block-right-part">
                <img
                    src="/images/avatar.png"
                    className="header-block-right-part-avatar"
                    alt="header-block-right-part-avatar"
                />
                <span className="header-block-right-part-name">
                    Александр Дудин
                </span>
            </div>
        </header>
    );
}
