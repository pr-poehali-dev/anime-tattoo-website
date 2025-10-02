function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h4 className="text-3xl font-black text-gradient mb-4">ANIME TATTOO</h4>
          <p className="text-gray-400 mb-6">© 2024 Все права защищены</p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
