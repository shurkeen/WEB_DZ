export default function Footer() {
    const currentYear = new Date().getFullYear();
    return <footer className="footer-block">ТРВП-007. РК6-72Б Александр Дудин. ©{currentYear} Все парава защищены.</footer>;
}
