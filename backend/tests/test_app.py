from app import app

def test_get_albums_success():
    """
    Prueba que el endpoint /api/albums responde con un código 200 (OK)
    y que el cuerpo de la respuesta es una lista.
    """
    client = app.test_client()
    
    response = client.get('/api/albums')
    
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0