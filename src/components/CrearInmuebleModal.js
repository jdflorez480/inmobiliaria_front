import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Button,
  Row,
  Col,
  message,
  Divider
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { crearInmueble, editarInmueble, eliminarImagen } from '../api';

const { Option } = Select;
const { TextArea } = Input;

const InmuebleModal = ({ visible, onClose, onSuccess, inmueble = null, modo = 'crear' }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [tipoConsignacion, setTipoConsignacion] = useState('');

  const esEdicion = modo === 'editar' && inmueble;

  useEffect(() => {
    if (esEdicion) {
      // Llenar los campos del formulario
      form.setFieldsValue({
        titulo: inmueble.titulo,
        ciudad: inmueble.ciudad,
        direccion: inmueble.direccion,
        habitaciones: inmueble.habitaciones,
        banos: inmueble.banos,
        metros_cuadrados: inmueble.metros_cuadrados,
        tipo_consignacion: inmueble.tipo_consignacion,
        valor_arriendo: inmueble.valor_arriendo,
        valor_venta: inmueble.valor_venta,
        descripcion: inmueble.descripcion,
        piscina: inmueble.piscina,
        ascensor: inmueble.ascensor,
        parqueadero: inmueble.parqueadero,
        parqueadero_comunal: inmueble.parqueadero_comunal,
      });
      setTipoConsignacion(inmueble.tipo_consignacion);
      
      // Configurar imágenes existentes
      if (inmueble.imagenes && inmueble.imagenes.length > 0) {
        const imagenesExistentes = inmueble.imagenes.map((img, index) => ({
          uid: `-existing-${img.id}`,
          name: img.nombre_original || `imagen-${index + 1}`,
          status: 'done',
          url: `${process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/storage/${img.ruta_imagen}`,
          existing: true,
          imagenId: img.id
        }));
        setFileList(imagenesExistentes);
      }
    }
  }, [esEdicion, inmueble, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Agregar todos los campos del formulario
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (typeof values[key] === 'boolean') {
            formData.append(key, values[key] ? '1' : '0');
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      const camposBooleanos = ['piscina', 'ascensor', 'parqueadero', 'parqueadero_comunal'];
      camposBooleanos.forEach(campo => {
        if (!formData.has(campo)) {
          formData.append(campo, '0');
        }
      });

      fileList.forEach((file) => {
        if (file.originFileObj && !file.existing) {
          formData.append('imagenes[]', file.originFileObj);
        }
      });

      let response;
      if (esEdicion) {
        response = await editarInmueble(inmueble.id, formData);
      } else {
        response = await crearInmueble(formData);
      }
      
      if (response.data.success) {
        message.success(esEdicion ? 'Inmueble actualizado exitosamente' : 'Inmueble creado exitosamente');
        handleCancel();
        if (onSuccess) onSuccess();
      } else {
        message.error(response.data.message || 'Error al procesar el inmueble');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
       
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(field => {
          message.error(`${field}: ${errors[field][0]}`);
        });
      } else {
        message.error(esEdicion ? 'Error al actualizar el inmueble' : 'Error al crear el inmueble');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    fileList,
    onChange: handleUploadChange,
    onRemove: async (file) => {
      // Si es una imagen existente, eliminarla del backend
      if (file.existing && esEdicion) {
        try {
          const response = await eliminarImagen(inmueble.id, file.imagenId);
          if (response.data.success) {
            message.success('Imagen eliminada');
            return true; // Permitir eliminación del componente
          } else {
            message.error('Error al eliminar la imagen');
            return false; // Prevenir eliminación del componente
          }
        } catch (error) {
          message.error('Error al eliminar la imagen del servidor');
          return false; // Prevenir eliminación del componente
        }
      }
      return true; // Para imágenes nuevas, permitir eliminación normal
    },
    beforeUpload: () => false, // Prevenir upload automático
    multiple: true,
    accept: 'image/jpeg,image/png,image/jpg,image/gif,image/webp',
    listType: 'picture-card',
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setTipoConsignacion('');
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl">{esEdicion ? '✏️' : '🏠'}</span>
          <span className="text-lg font-semibold">
            {esEdicion ? 'Editar Inmueble' : 'Crear Nuevo Inmueble'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="top-4"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Divider orientation="left">📍 Información Básica</Divider>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="titulo"
              label="Título del Inmueble"
              rules={[
                { required: true, message: 'El título es requerido' },
                { max: 255, message: 'El título no puede exceder 255 caracteres' }
              ]}
            >
              <Input placeholder="Ej: Casa moderna en Bucaramanga" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="ciudad"
              label="Ciudad"
              rules={[{ required: true, message: 'La ciudad es requerida' }]}
            >
              <Input placeholder="Ej: Bucaramanga, Medellín, Cali..." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="direccion"
              label="Dirección"
              rules={[{ required: true, message: 'La dirección es requerida' }]}
            >
              <Input placeholder="Ej: Calle 123 #45-67" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="habitaciones"
              label="Habitaciones"
              rules={[{ required: true, message: 'Número de habitaciones requerido' }]}
            >
              <InputNumber 
                min={1} 
                placeholder="Ej: 3"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="banos"
              label="Baños"
              rules={[{ required: true, message: 'Número de baños requerido' }]}
            >
              <InputNumber 
                min={1} 
                placeholder="Ej: 2"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="metros_cuadrados"
              label="Metros Cuadrados"
            >
              <InputNumber 
                min={0} 
                placeholder="Ej: 80"
                style={{ width: '100%' }}
                addonAfter="m²"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Divider orientation="left">💰 Información Comercial</Divider>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="tipo_consignacion"
              label="Tipo de Consignación"
              rules={[{ required: true, message: 'Selecciona el tipo de consignación' }]}
            >
              <Select 
                placeholder="Seleccionar..."
                onChange={setTipoConsignacion}
              >
                <Option value="arriendo">🏠 Arriendo</Option>
                <Option value="venta">💰 Venta</Option>
              </Select>
            </Form.Item>
          </Col>

          {tipoConsignacion === 'arriendo' && (
            <Col xs={24} sm={8}>
              <Form.Item
                name="valor_arriendo"
                label="Valor Arriendo (Mensual)"
                rules={[{ required: true, message: 'El valor de arriendo es requerido' }]}
              >
                <InputNumber 
                  min={0} 
                  placeholder="Ej: 1500000"
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          )}

          {tipoConsignacion === 'venta' && (
            <Col xs={24} sm={8}>
              <Form.Item
                name="valor_venta"
                label="Valor Venta"
                rules={[{ required: true, message: 'El valor de venta es requerido' }]}
              >
                <InputNumber 
                  min={0} 
                  placeholder="Ej: 250000000"
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Divider orientation="left">⭐ Características Adicionales</Divider>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Item
              name="piscina"
              label="Piscina"
              valuePropName="checked"
            >
              <Switch checkedChildren="Sí" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Item
              name="ascensor"
              label="Ascensor"
              valuePropName="checked"
            >
              <Switch checkedChildren="Sí" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Item
              name="parqueadero"
              label="Parqueadero"
              valuePropName="checked"
            >
              <Switch checkedChildren="Sí" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Item
              name="parqueadero_comunal"
              label="Parqueadero Comunal"
              valuePropName="checked"
            >
              <Switch checkedChildren="Sí" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="descripcion"
              label="Descripción"
            >
              <TextArea 
                rows={4} 
                placeholder="Describe las características del inmueble, ubicación, servicios cercanos, etc."
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Divider orientation="left">📸 Imágenes del Inmueble</Divider>
            <Form.Item
              label="Subir Imágenes"
              extra="Máximo 2MB por imagen. Formatos: JPEG, PNG, JPG, GIF, WEBP"
            >
              <Upload {...uploadProps}>
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <PlusOutlined className="text-2xl text-gray-400 mb-2" />
                  <span className="text-gray-500">Haz clic o arrastra imágenes aquí</span>
                </div>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button 
                onClick={handleCancel}
                className="px-6"
              >
                ❌ Cancelar
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="px-6 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
              >
                {esEdicion ? '✅ Actualizar Inmueble' : '✅ Crear Inmueble'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default InmuebleModal;
