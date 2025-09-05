import React, { useEffect, useState } from 'react';
import { listarInmuebles, obtenerCiudades, eliminarInmueble } from '../api';
import InmuebleModal from './CrearInmuebleModal';
import {
  Card,
  Button,
  Select,
  Input,
  Spin,
  Tag,
  Row,
  Col,
  Typography,
  Space,
  Empty,
  Dropdown,
  Menu,
  Slider,
  Modal,
  Checkbox,
  message,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchOutlined, DownOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const habitacionesOpciones = [1, 2, 3, 4, 5];
const banosOpciones = [1, 2, 3, 4];

const rangosPrecio = [
  { label: 'Hasta $100M', value: [0, 100000000] },
  { label: '$100M - $200M', value: [100000000, 200000000] },
  { label: '$200M - $300M', value: [200000000, 300000000] },
  { label: '$300M - $500M', value: [300000000, 500000000] },
  { label: '$500M - $800M', value: [500000000, 800000000] },
  { label: 'Más de $800M', value: [800000000, 999999999] },
];

const rangosArriendo = [
  { label: 'Hasta $500K', value: [0, 500000] },
  { label: '$500K - $800K', value: [500000, 800000] },
  { label: '$800K - $1.2M', value: [800000, 1200000] },
  { label: '$1.2M - $2M', value: [1200000, 2000000] },
  { label: 'Más de $2M', value: [2000000, 999999999] },
];

const InmueblesList = () => {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ciudades, setCiudades] = useState([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filtrosTemp, setFiltrosTemp] = useState({
    habitaciones: [],
    banos: [],
  });
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [inmuebleEditar, setInmuebleEditar] = useState(null);
  const [inmuebleEliminar, setInmuebleEliminar] = useState(null);
  const [eliminandoInmueble, setEliminandoInmueble] = useState(false);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo_consignacion: '',
    precio_min: '',
    precio_max: '',
    habitaciones: [],
    banos: [],
    piscina: false,
    ascensor: false,
    parqueadero: false,
  });

  // Inicializar filtros temporales con los valores actuales
  useEffect(() => {
    setFiltrosTemp({
      habitaciones: filtros.habitaciones,
      banos: filtros.banos,
    });
  }, [filtros.habitaciones, filtros.banos]);

  const handleTempFiltroChange = (tipo, valor) => {
    setFiltrosTemp(prev => {
      const current = prev[tipo] || [];
      const newValues = current.includes(valor)
        ? current.filter(item => item !== valor)
        : [...current, valor];
      return { ...prev, [tipo]: newValues };
    });
  };

  const aplicarFiltrosHabitacionesBanos = () => {
    handleFiltroChange('habitaciones', filtrosTemp.habitaciones);
    handleFiltroChange('banos', filtrosTemp.banos);
    setDropdownVisible(false);
  };

  const cancelarFiltrosHabitacionesBanos = () => {
    setFiltrosTemp({
      habitaciones: filtros.habitaciones,
      banos: filtros.banos,
    });
    setDropdownVisible(false);
  };

  const handleCrearInmuebleSuccess = () => {
    // Recargar la lista de inmuebles después de crear uno nuevo
    cargarInmuebles();
  };

  const abrirModalCrear = () => {
    setModalCrearVisible(true);
  };

  const cerrarModalCrear = () => {
    setModalCrearVisible(false);
  };

  const abrirModalEditar = (inmueble) => {
    setInmuebleEditar(inmueble);
    setModalEditarVisible(true);
  };

  const cerrarModalEditar = () => {
    setModalEditarVisible(false);
    setInmuebleEditar(null);
  };

  const handleEliminarInmueble = (inmueble) => {
    setInmuebleEliminar(inmueble);
    setModalEliminarVisible(true);
  };

  const confirmarEliminarInmueble = async () => {
    if (!inmuebleEliminar) return;
    
    setEliminandoInmueble(true);
    try {
      const response = await eliminarInmueble(inmuebleEliminar.id);
      
      if (response.data.success) {
        message.success('Inmueble eliminado exitosamente');
        cargarInmuebles();
        setModalEliminarVisible(false);
        setInmuebleEliminar(null);
      } else {
        message.error('Error al eliminar el inmueble');
      }
    } catch (error) {
      message.error('Error al eliminar el inmueble');
    } finally {
      setEliminandoInmueble(false);
    }
  };

  const cancelarEliminarInmueble = () => {
    setModalEliminarVisible(false);
    setInmuebleEliminar(null);
  };

  useEffect(() => {
    obtenerCiudades().then(res => {
      if (res.data.success) setCiudades(res.data.data);
    });
    cargarInmuebles();
  }, []);

  const cargarInmuebles = async (params = {}) => {
    setLoading(true);
    try {
      const res = await listarInmuebles(params);
      if (res.data.success) {
        setInmuebles(res.data.data);
      }
    } catch (err) {
      setInmuebles([]);
    }
    setLoading(false);
  };

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = () => {
    const params = {};
    
    // Filtro por ciudad/ubicación - el backend usa LIKE
    if (filtros.busqueda) params.ciudad = filtros.busqueda;
    
    // Tipo de consignación
    if (filtros.tipo_consignacion) params.tipo_consignacion = filtros.tipo_consignacion;
    
    // Precios - se aplican según el tipo de consignación activo
    if (filtros.precio_min) params.precio_min = filtros.precio_min;
    if (filtros.precio_max && filtros.precio_max !== 999999999) params.precio_max = filtros.precio_max;
    
    // Habitaciones - múltiple como string separada por comas
    if (filtros.habitaciones.length > 0) params.habitaciones = filtros.habitaciones.join(',');
    

    if (filtros.banos.length > 0) params.banos = filtros.banos.join(',');
    
    // Características booleanas
    if (filtros.piscina) params.piscina = true;
    if (filtros.ascensor) params.ascensor = true;
    if (filtros.parqueadero) params.parqueadero = true;
    
    console.log('Parámetros enviados al backend:', params);
    cargarInmuebles(params);
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      tipo_consignacion: '',
      precio_min: '',
      precio_max: '',
      habitaciones: [],
      banos: [],
      piscina: false,
      ascensor: false,
      parqueadero: false,
    });
    cargarInmuebles();
  };

  const aplicarRangoPrecio = (rango) => {
    setFiltros(prev => ({
      ...prev,
      precio_min: rango[0],
      precio_max: rango[1] === 999999999 ? '' : rango[1]
    }));
  };

  const menuPrecio = (
    <Menu>
      <Menu.ItemGroup title="Todos los tipos">
        {rangosPrecio.map((rango, index) => (
          <Menu.Item key={`general-${index}`} onClick={() => aplicarRangoPrecio(rango.value)}>
            {rango.label}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
      {filtros.tipo_consignacion === 'arriendo' && (
        <Menu.ItemGroup title="Arriendo">
          {rangosArriendo.map((rango, index) => (
            <Menu.Item key={`arriendo-${index}`} onClick={() => aplicarRangoPrecio(rango.value)}>
              {rango.label}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      )}
    </Menu>
  );

  const menuCiudades = (
    <Menu>
      <Menu.Item onClick={() => handleFiltroChange('busqueda', '')}>
        Todas las ciudades
      </Menu.Item>
      {ciudades.map((ciudad) => (
        <Menu.Item key={ciudad} onClick={() => handleFiltroChange('busqueda', ciudad)}>
          {ciudad}
        </Menu.Item>
      ))}
    </Menu>
  );

  const menuHabitacionesBanos = (
    <div className="p-3 min-w-60">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Habitaciones</h4>
        <div className="space-y-2">
          {habitacionesOpciones.map((num) => (
            <div key={`hab-${num}`} className="flex items-center">
              <Checkbox 
                checked={filtrosTemp.habitaciones.includes(num)}
                onChange={() => handleTempFiltroChange('habitaciones', num)}
              >
                {num} habitación{num > 1 ? 'es' : ''}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Baños</h4>
        <div className="space-y-2">
          {banosOpciones.map((num) => (
            <div key={`ban-${num}`} className="flex items-center">
              <Checkbox 
                checked={filtrosTemp.banos.includes(num)}
                onChange={() => handleTempFiltroChange('banos', num)}
              >
                {num} baño{num > 1 ? 's' : ''}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2 pt-2 border-t">
        <Button 
          type="primary" 
          size="small" 
          onClick={aplicarFiltrosHabitacionesBanos}
          className="flex-1 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <span className="flex items-center justify-center gap-1">
            ✅ <span className="font-medium">Aplicar</span>
          </span>
        </Button>
        <Button 
          size="small" 
          onClick={cancelarFiltrosHabitacionesBanos}
          className="flex-1 bg-gray-100 hover:bg-gray-200 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <span className="flex items-center justify-center gap-1">
            ❌ <span className="font-medium">Cancelar</span>
          </span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">📋 Listado de Inmuebles</Title>
        <Button 
          type="primary" 
          size="large"
          className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={abrirModalCrear}
        >
          <span className="flex items-center gap-2">
            ➕ <span className="font-semibold">Crear Nuevo Inmueble</span>
          </span>
        </Button>
      </div>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} sm={6} md={4}>
            <Input
              placeholder="Buscar ubicación..."
              prefix={<SearchOutlined />}
              value={filtros.busqueda}
              onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              className="h-10"
            />
          </Col>
          
          <Col xs={12} sm={4} md={3}>
            <Dropdown overlay={menuCiudades}>
              <Button className="w-full h-10 text-left flex items-center justify-between">
                {filtros.busqueda && ciudades.includes(filtros.busqueda) ? filtros.busqueda : 'Ciudad'} <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
          
          <Col xs={12} sm={4} md={3}>
            <Dropdown overlay={
              <Menu>
                <Menu.Item onClick={() => handleFiltroChange('tipo_consignacion', '')}>
                  Todos
                </Menu.Item>
                <Menu.Item onClick={() => handleFiltroChange('tipo_consignacion', 'venta')}>
                  Venta
                </Menu.Item>
                <Menu.Item onClick={() => handleFiltroChange('tipo_consignacion', 'arriendo')}>
                  Arriendo
                </Menu.Item>
              </Menu>
            }>
              <Button className="w-full h-10 text-left flex items-center justify-between">
                {filtros.tipo_consignacion === 'venta' ? 'Venta' : 
                 filtros.tipo_consignacion === 'arriendo' ? 'Arriendo' : 'Tipo'} <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
          
          <Col xs={12} sm={4} md={3}>
            <Dropdown overlay={menuPrecio}>
              <Button className="w-full h-10 text-left flex items-center justify-between">
                Precio <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
          
          <Col xs={12} sm={4} md={3}>
            <Dropdown 
              overlay={menuHabitacionesBanos}
              trigger={['click']}
              placement="bottomLeft"
              open={dropdownVisible}
              onOpenChange={(visible) => {
                if (visible) {
                  // Al abrir, resetear los filtros temporales con los valores actuales
                  setFiltrosTemp({
                    habitaciones: filtros.habitaciones,
                    banos: filtros.banos,
                  });
                }
                setDropdownVisible(visible);
              }}
            >
              <Button className="w-full h-10 text-left flex items-center justify-between">
                {(filtros.habitaciones.length > 0 || filtros.banos.length > 0) 
                  ? `${filtros.habitaciones.length > 0 ? filtros.habitaciones.join(',') + ' hab' : ''} ${filtros.banos.length > 0 ? filtros.banos.join(',') + ' baño' : ''}`.trim()
                  : 'Habs. y baños'} <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
          
          {/* Más filtros */}
          <Col xs={12} sm={4} md={3}>
            <Button 
              icon={<FilterOutlined />}
              className="w-full h-10 bg-purple-50 hover:bg-purple-100 border-purple-300 hover:border-purple-400 text-purple-700 hover:text-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => setShowMoreFilters(true)}
            >
              <span className="flex items-center gap-1">
                ⚙️ <span className="font-medium">Más filtros</span>
              </span>
            </Button>
          </Col>
          
          {/* Texto de ayuda */}
          <Col xs={24} className="text-center mb-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
              <span className="text-sm text-blue-700 flex items-center justify-center gap-2">
                💡 <span className="font-medium">Selecciona los filtros deseados y haz clic en "Buscar" para aplicarlos</span>
              </span>
            </div>
          </Col>
          
          {/* Botones de acción */}
          <Col xs={24} sm={6} md={4}>
            <Space>
              <Button 
                type="primary" 
                onClick={aplicarFiltros} 
                className="h-10 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center gap-1">
                  🔍 <span className="font-medium">Buscar</span>
                </span>
              </Button>
              <Button 
                onClick={limpiarFiltros} 
                className="h-10 bg-gray-100 hover:bg-gray-200 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center gap-1">
                  🗑️ <span className="font-medium">Limpiar</span>
                </span>
              </Button>
            </Space>
          </Col>
        </Row>
        
        {/* Filtros activos */}
        {(filtros.busqueda || filtros.tipo_consignacion || filtros.habitaciones.length > 0 || filtros.banos.length > 0 || filtros.precio_min || filtros.precio_max) && (
          <div className="mt-3 pt-3 border-t">
            <Space wrap>
              {filtros.busqueda && (
                <Tag closable onClose={() => handleFiltroChange('busqueda', '')}>
                  Ubicación: {filtros.busqueda}
                </Tag>
              )}
              {filtros.tipo_consignacion && (
                <Tag closable onClose={() => handleFiltroChange('tipo_consignacion', '')}>
                  Tipo: {filtros.tipo_consignacion}
                </Tag>
              )}
              {filtros.habitaciones.length > 0 && (
                <Tag closable onClose={() => handleFiltroChange('habitaciones', [])}>
                  Habitaciones: {filtros.habitaciones.join(', ')}
                </Tag>
              )}
              {filtros.banos.length > 0 && (
                <Tag closable onClose={() => handleFiltroChange('banos', [])}>
                  Baños: {filtros.banos.join(', ')}
                </Tag>
              )}
              {(filtros.precio_min || filtros.precio_max) && (
                <Tag closable onClose={() => handleFiltroChange('precio_min', '') || handleFiltroChange('precio_max', '')}>
                  Precio: ${filtros.precio_min?.toLocaleString() || '0'} - ${filtros.precio_max?.toLocaleString() || '∞'}
                </Tag>
              )}
            </Space>
          </div>
        )}
      </div>

      {/* Modal de más filtros */}
      <Modal
        title="Más filtros"
        open={showMoreFilters}
        onOk={() => setShowMoreFilters(false)}
        onCancel={() => setShowMoreFilters(false)}
        okText="Aplicar"
        cancelText="Cancelar"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Características adicionales</label>
            <Space wrap>
              <Checkbox
                checked={filtros.piscina}
                onChange={(e) => handleFiltroChange('piscina', e.target.checked)}
              >
                Piscina
              </Checkbox>
              <Checkbox
                checked={filtros.ascensor}
                onChange={(e) => handleFiltroChange('ascensor', e.target.checked)}
              >
                Ascensor
              </Checkbox>
              <Checkbox
                checked={filtros.parqueadero}
                onChange={(e) => handleFiltroChange('parqueadero', e.target.checked)}
              >
                Parqueadero
              </Checkbox>
            </Space>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Rango de precio personalizado</label>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Input
                  placeholder="Precio mínimo"
                  type="number"
                  value={filtros.precio_min}
                  onChange={(e) => handleFiltroChange('precio_min', e.target.value ? Number(e.target.value) : '')}
                  prefix="$"
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Precio máximo"
                  type="number"
                  value={filtros.precio_max === 999999999 ? '' : filtros.precio_max}
                  onChange={(e) => handleFiltroChange('precio_max', e.target.value ? Number(e.target.value) : '')}
                  prefix="$"
                />
              </Col>
            </Row>
          </div>
        </div>
      </Modal>

      {loading ? (
        <div className="flex justify-center mt-8">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {inmuebles.length === 0 ? (
            <Col span={24}>
              <Empty description="No se encontraron inmuebles" />
            </Col>
          ) : (
            inmuebles.map((inmueble) => (
              <Col xs={24} sm={12} md={8} lg={6} key={inmueble.id}>
                <Card
                  hoverable
                  className="h-full overflow-hidden"
                  cover={
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={`Inmueble en ${inmueble.ciudad}`}
                        src={inmueble.imagenes && inmueble.imagenes.length > 0 
                          ? `http://127.0.0.1:8000/storage/${inmueble.imagenes[0].ruta_imagen}`
                          : 'https://placehold.co/400'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <Button 
                          shape="circle" 
                          icon={<span className="text-red-500">♡</span>} 
                          className="bg-white/80 border-none shadow-md hover:bg-white"
                          size="small"
                        />
                      </div>
                    </div>
                  }
                  bodyStyle={{ padding: '16px' }}
                >
                  <div className="space-y-3">
                    {/* Título y Ubicación */}
                    <div>
                      <Title level={4} className="mb-1 text-gray-900">
                        {inmueble.titulo || `Inmueble en ${inmueble.ciudad}`}
                      </Title>
                      <Title level={5} className="mb-1 text-gray-600">{inmueble.ciudad}</Title>
                      <p className="text-gray-500 text-sm m-0">{inmueble.direccion}</p>
                    </div>
                    
                    {/* Tags de características */}
                    <div className="flex flex-wrap gap-1">
                      <Tag color="blue" className="text-xs">{inmueble.habitaciones} habitaciones</Tag>
                      <Tag color="green" className="text-xs">{inmueble.banos} baños</Tag>
                      <Tag color={inmueble.tipo_consignacion === 'venta' ? 'orange' : 'purple'} className="text-xs">
                        {inmueble.tipo_consignacion}
                      </Tag>
                    </div>
                    
                    {/* Precio */}
                    <div>
                      <Title level={4} className="mb-1 text-green-600">
                        ${inmueble.tipo_consignacion === 'venta'
                          ? Number(inmueble.valor_venta).toLocaleString()
                          : Number(inmueble.valor_arriendo).toLocaleString()}
                        {inmueble.tipo_consignacion === 'arriendo' && <span className="text-sm text-gray-500">/mes</span>}
                      </Title>
                    </div>
                    
                    {/* Descripción corta */}
                    <div>
                      <p className="text-gray-600 text-sm m-0 line-clamp-2">
                        {inmueble.descripcion || 'Apartamento disponible'}
                      </p>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="pt-2 space-y-2">
                      <Button 
                        type="primary" 
                        block 
                        onClick={() => window.location.href = `/inmueble/${inmueble.id}`}
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <span className="flex items-center justify-center gap-2">
                          👁️ <span className="font-medium">Ver Detalles Completos</span> →
                        </span>
                      </Button>
                      
                      {/* Botones de editar y eliminar */}
                      <div className="flex gap-2">
                        <Button 
                          block
                          onClick={() => abrirModalEditar(inmueble)}
                          className="bg-yellow-50 hover:bg-yellow-100 border-yellow-300 hover:border-yellow-400 text-yellow-700 hover:text-yellow-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <span className="flex items-center justify-center gap-1">
                            ✏️ <span className="font-medium">Editar</span>
                          </span>
                        </Button>
                        
                        <Button 
                          block
                          onClick={() => handleEliminarInmueble(inmueble)}
                          className="bg-red-50 hover:bg-red-100 border-red-300 hover:border-red-400 text-red-700 hover:text-red-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <span className="flex items-center justify-center gap-1">
                            🗑️ <span className="font-medium">Eliminar</span>
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      {/* Modal para crear inmueble */}
      <InmuebleModal
        visible={modalCrearVisible}
        onClose={cerrarModalCrear}
        onSuccess={handleCrearInmuebleSuccess}
        modo="crear"
      />

      {/* Modal para editar inmueble */}
      <InmuebleModal
        visible={modalEditarVisible}
        onClose={cerrarModalEditar}
        onSuccess={handleCrearInmuebleSuccess}
        inmueble={inmuebleEditar}
        modo="editar"
      />

      {/* Modal para confirmar eliminación */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-red-500 text-xl" />
            <span className="text-lg font-semibold text-red-600">
              ¿Confirmar Eliminación?
            </span>
          </div>
        }
        open={modalEliminarVisible}
        onCancel={cancelarEliminarInmueble}
        centered
        footer={[
          <Button 
            key="cancelar" 
            onClick={cancelarEliminarInmueble}
            className="bg-gray-100 hover:bg-gray-200 border-gray-300 hover:border-gray-400"
          >
            ❌ Cancelar
          </Button>,
          <Button 
            key="eliminar" 
            type="primary" 
            danger
            loading={eliminandoInmueble}
            onClick={confirmarEliminarInmueble}
            className="bg-red-600 hover:bg-red-700"
          >
            🗑️ Sí, Eliminar
          </Button>
        ]}
      >
        {inmuebleEliminar && (
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-gray-800 mb-2">
                <strong>Inmueble a eliminar:</strong>
              </p>
              <p className="text-lg font-semibold text-red-700 mb-1">
                {inmuebleEliminar.titulo || `Inmueble en ${inmuebleEliminar.ciudad}`}
              </p>
              <p className="text-gray-600 text-sm">
                📍 {inmuebleEliminar.direccion}, {inmuebleEliminar.ciudad}
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Advertencia:</strong> Esta acción no se puede deshacer. 
                Se eliminará permanentemente el inmueble y todas sus imágenes asociadas.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InmueblesList;
