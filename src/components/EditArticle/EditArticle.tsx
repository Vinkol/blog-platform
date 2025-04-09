import React, { useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { Input, Button, Form, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://blog-platform.kata.academy/api/articles/${slug}`, {
          headers: { Authorization: `Token ${token}` }
        });
        const article = response.data.article;
        setValue('title', article.title);
        setValue('short_description', article.short_description);
        setValue('text', article.text);
      } catch (error) {
        message.error('Ошибка при загрузке статьи');
      }
    };

    fetchArticle();
  }, [slug, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        { article: data },
        { headers: { Authorization: `Token ${token}` } }
      );
      message.success('Статья успешно обновлена');
      history(`/articles/${slug}`);
    } catch (error) {
      message.error('Ошибка при редактировании статьи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Редактирование статьи</h1>
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
          Сохранить изменения
        </Button>
      </Form>
    </div>
  );
};

export default EditArticle;
