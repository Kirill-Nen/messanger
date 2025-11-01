from app import app, init_models

#стартер
def start_app(
    host: str = 'localhost',
    port: int = 3000,
    debug: bool = True
):
    init_models()
    app.run(
        host=host,
        port=port,
        debug=debug
    )

    
if __name__ == '__main__':
    start_app()