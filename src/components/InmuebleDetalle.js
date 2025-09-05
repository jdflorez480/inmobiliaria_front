import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerInmueble } from '../api';
import {
  Card,
  Button,
  Tag,
  Typography,
  Spin,
  Row,
  Col,
  Space,
  Divider,
  Image,
  message,
} from 'antd';
import {
  HomeOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const InmuebleDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inmueble, setInmueble] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarInmueble = async () => {
      try {
        const res = await obtenerInmueble(id);
        if (res.data.success) {
          setInmueble(res.data.data);
        } else {
          message.error('Inmueble no encontrado');
          navigate('/');
        }
      } catch (err) {
        message.error('Error al cargar el inmueble');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) cargarInmueble();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!inmueble) {
    return null;
  }

  const imagenPrincipal = inmueble.imagenes && inmueble.imagenes.length > 0 
    ? `http://127.0.0.1:8000/storage/${inmueble.imagenes[0].ruta_imagen}`
    : 'https://placehold.co/400';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        className="mb-4"
      >
        Volver al listado
      </Button>

      <Card className="overflow-hidden">
        <div className="relative">
          <Image
            src={imagenPrincipal}
            alt={inmueble.titulo || `Inmueble en ${inmueble.ciudad}`}
            className="w-full h-80 object-cover"
            fallback="https://placehold.co/400"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center mb-2">
            <EnvironmentOutlined className="text-gray-500 mr-2" />
            <Text className="text-gray-600">{inmueble.ciudad}</Text>
          </div>

          <Title level={2} className="text-blue-600 mb-4">
            ${inmueble.tipo_consignacion === 'venta' 
              ? Number(inmueble.valor_venta).toLocaleString() 
              : Number(inmueble.valor_arriendo).toLocaleString()}
            {inmueble.tipo_consignacion === 'arriendo' && <span className="text-sm">/mes</span>}
          </Title>

          <Title level={3} className="mb-2">
            {inmueble.titulo || `${inmueble.tipo_consignacion === 'venta' ? 'Apartamento en Venta' : 'Apartamento en Arriendo'}`}
          </Title>
          
          <Title level={5} className="mb-4 text-gray-600">
            {inmueble.ciudad} • {inmueble.tipo_consignacion === 'venta' ? 'En Venta' : 'En Arriendo'}
          </Title>

          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={12} sm={6}>
              <div className="flex items-center">
                <ExpandOutlined className="text-gray-500 mr-2" />
                <div>
                  <div className="font-semibold">{inmueble.metros_cuadrados || 'N/A'} m²</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="flex items-center">
                <HomeOutlined className="text-gray-500 mr-2" />
                <div>
                  <div className="font-semibold">{inmueble.habitaciones} hab.</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 text-gray-500">🚿</div>
                <div>
                  <div className="font-semibold">{inmueble.banos} ban.</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="flex items-center">
                <CarOutlined className="text-gray-500 mr-2" />
                <div>
                  <div className="font-semibold">
                    {inmueble.parqueadero || inmueble.parqueadero_comunal ? '1 par.' : '0 par.'}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Button 
            type="primary" 
            size="large" 
            icon={<PhoneOutlined />}
            className="w-full mb-6 h-12"
          >
            Contactar
          </Button>

          <Divider />

          <div className="mb-6">
            <Title level={5} className="mb-3">Características</Title>
            <Space wrap>
              <Tag color="blue">{inmueble.tipo_consignacion}</Tag>
              {inmueble.piscina && <Tag color="cyan">Piscina</Tag>}
              {inmueble.ascensor && <Tag color="green">Ascensor</Tag>}
              {inmueble.parqueadero && <Tag color="orange">Parqueadero privado</Tag>}
              {inmueble.parqueadero_comunal && <Tag color="purple">Parqueadero comunal</Tag>}
            </Space>
          </div>

          <div className="mb-6">
            <Title level={5} className="mb-2">Dirección</Title>
            <Text className="text-gray-600">{inmueble.direccion}</Text>
          </div>

          {inmueble.descripcion && (
            <div className="mb-6">
              <Title level={5} className="mb-3">Descripción</Title>
              <Text className="text-gray-700 leading-relaxed">
                {inmueble.descripcion}
              </Text>
            </div>
          )}

          {inmueble.imagenes && inmueble.imagenes.length > 1 && (
            <div>
              <Title level={5} className="mb-3">Galería</Title>
              <Row gutter={[8, 8]}>
                {inmueble.imagenes.slice(1).map((imagen, index) => (
                  <Col xs={12} sm={8} md={6} key={imagen.id}>
                    <Image
                      src={`http://127.0.0.1:8000/storage/${imagen.ruta_imagen}`}
                      alt={`Imagen ${index + 2}`}
                      className="w-full h-24 object-cover rounded"
                      fallback="https://placehold.co/400"
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InmuebleDetalle;
