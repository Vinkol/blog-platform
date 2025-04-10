import { useEffect, useState } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateArticleMutation, useUpdateArticleMutation } from '../../api/apiSlice';
import { Tag, Input, Button } from 'antd';
import cl from './NewArticle.module.sass';
import { NewArticleProps } from '../../types/types';

const NewArticle = ({ mode = 'create', initialData = {
  title: '',
  body: '',
  tagList: [],
  description: ''
}, articleSlug }: NewArticleProps) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState(initialData.tagList || []);
  const [inputValue, setInputValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      shortDescription: initialData.description || '',
      text: initialData.body || '',
    },
  });

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (removedTag: any) => {
    setTags(tags.filter((tag: string) => tag !== removedTag));
  };

  const onSubmit = async (data: any) => {
    const formattedData = {
      title: data.title,
      description: data.shortDescription,
      body: data.text,
      tagList: tags,
    };
    if (mode === 'create') {
      await createArticle(formattedData).unwrap();
      navigate('/');
    } else if (mode === 'edit') {
      if (!articleSlug) {
        console.error('Ошибка: articleSlug не задан');
        return;
      }
      await updateArticle({ slug: articleSlug, updatedArticle: formattedData }).unwrap();
      reset({
        title: formattedData.title,
        shortDescription: formattedData.description,
        text: formattedData.body,
      });
      navigate('/');
    }
    reset();
  };

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      for (const [key, value] of Object.entries(initialData)) {
        if (key === 'title' || key === 'shortDescription' || key === 'text') {
          setValue(key as 'title' | 'shortDescription' | 'text', value as string);
        }
        if (key === 'tagList' && Array.isArray(value)) {
          setTags(value);
        }
      }
      setTags(initialData.tagList || []);
    }
  }, [mode, initialData, setValue]);

  return (
    <div className={cl.signIn}>
      <h2 className={cl.mainTitle}>
        {mode === 'create' ? 'Create new article' : 'Edit article'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cl.wrap}>
          <label className={cl.labelTitle} htmlFor="title">
            Заголовок
          </label>
          <input
            {...register('title', { required: 'Enter title' })}
            placeholder="Title"
            type="text"
            className={cl.title}
            onBlur={() => trigger('title')}
          />
          {errors.title && <p className={cl.error}>{(errors.title as FieldError).message}</p>}

          <label className={cl.labelShortDescription} htmlFor="shortDescription">
            Short description
          </label>
          <input
            {...register('shortDescription', { required: 'Enter description' })}
            placeholder="Short description"
            type="text"
            className={cl.shortDescription}
            onBlur={() => trigger('shortDescription')}
          />
          {errors.shortDescription && (
            <p className={cl.error}>{(errors.shortDescription as FieldError).message}</p>
          )}

          <label className={cl.labelShortDescription} htmlFor="text">
            Text
          </label>
          <input
            {...register('text', { required: 'Enter text' })}
            placeholder="Text"
            type="text"
            className={cl.textInput}
            onBlur={() => trigger('text')}
          />
          {errors.text && <p className={cl.error}>{(errors.text as FieldError).message}</p>}

          <label className={cl.labelTags} htmlFor="tags">
            Tags
          </label>
          <div className={cl.tagsContainer}>
            {tags.map((tag: string) => (
              <Tag key={tag} closable onClose={() => handleRemoveTag(tag)} className={cl.tag}>
                {tag}
              </Tag>
            ))}
          </div>
          <div className={cl.addTagContainer}>
            <Input
              type="text"
              placeholder="Tag"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cl.addTagInput}
            />
            <Button type="primary" onClick={handleAddTag} className={cl.addTagButton}>
              Add tag
            </Button>
          </div>
        </div>
        <Button type="primary" htmlType="submit" className={cl.btnLogin}>
          {mode === 'create' ? 'Send' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default NewArticle;
