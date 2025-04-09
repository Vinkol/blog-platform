import React, { useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { Input, Button, Form, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewArticle: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://blog-platform.kata.academy/api/articles',
        { article: data },
        { headers: { Authorization: `Token ${token}` } }
      );
      message.success('Статья успешно создана');
      history('/');
    } catch (error) {
      message.error('Ошибка при создании статьи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Создание статьи</h1>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
        <Form.Item label="Заголовок" required>
          <Input
            {...register('title', { required: 'Заголовок обязателен' })}
            placeholder="Заголовок"
          />
          {errors.title && <span>{(errors.title as FieldError).message}</span>}
        </Form.Item>
        <Form.Item label="Краткое описание" required>
          <Input
            {...register('short_description', { required: 'Краткое описание обязательно' })}
            placeholder="Краткое описание"
          />
          {errors.short_description && <span>{(errors.short_description as FieldError).message}</span>}
        </Form.Item>
        <Form.Item label="Текст" required>
          <Input.TextArea
            {...register('text', { required: 'Текст обязателен' })}
            placeholder="Текст статьи"
            rows={4}
          />
          {errors.title && <span>{(errors.title as FieldError).message}</span>}
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Создать статью
        </Button>
      </Form>
    </div>
  );
};

export default NewArticle;
