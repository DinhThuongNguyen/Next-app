import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage } from "formik";
import TextError from "../textError/TextError";
import css from "./style.module.scss";
import axios from "../../../Axios/methodApi";

const Image = (props) => {
  const { field, form, type, label } = props;
  const { name } = field;
  // const { errors, touched } = form;
  const avatarPickerRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(field.value);
  const [files, setFile] = useState();

  useEffect(() => {
    if (!files) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(files);
  }, [files]);

  function pickImageHandler() {
    avatarPickerRef.current.click();
  }

  function valueImage(e) {
    try {
      let pickFile;
      if (e.currentTarget.files && e.currentTarget.files.length === 1) {
        pickFile = e.currentTarget.files[0];
        setFile(pickFile);
        const formData = new FormData();
        formData.append("image", pickFile);
        axios
          .postFile("/image", formData)
          .then((res) => {
            form.setFieldValue(name, res.path);
          })
          .catch((err) => {
            console.log({ err });
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={css.formImage}>
      <div className={css.formImage__input}>
        <label htmlFor={name}>{label}</label>
        {type && (
          <input
            id={name}
            style={{ display: "none" }}
            type={type}
            accept=".jpg, .png, .jpeg"
            ref={avatarPickerRef}
            onChange={valueImage}
          />
        )}
      </div>

      <div className={css.formImage__showIMG}>
        <div className={css.formImage__showIMG__anh}>
          {!previewUrl ? (
            <i>Ảnh đại diện</i>
          ) : (
            <img src={previewUrl} alt="avatar" />
          )}
        </div>
        <ErrorMessage name={name} component={TextError} />
        <button
          className="btn btn-info"
          onClick={pickImageHandler}
          type="button"
        >
          Choose avatar
        </button>
      </div>
    </div>
  );
};

export default Image;