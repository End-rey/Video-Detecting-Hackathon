import logging

def create_logger():    
    # Создаем логгер
    logger = logging.getLogger("uvicorn")
    logger.setLevel(logging.DEBUG)
    
    # Создаем обработчик для вывода сообщений в консоль
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    
    # Создаем форматтер для сообщений логирования
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # Настраиваем обработчик сообщений для использования указанного форматтера
    console_handler.setFormatter(formatter)
    
    # Добавляем обработчик к логгеру
    logger.addHandler(console_handler)
    
    return logger