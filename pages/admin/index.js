import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Axios from "../../Axios/methodApi";
import BaseLayout from '../../components/Layouts/BaseLayout/BaseLayout';
import { AuthContext } from '../../ContextAPI/Auth-context';
import css from "./style.module.scss";

const index = () => {
  const auth = useContext(AuthContext);
  const route = useRouter();
  const [arr, setArr] = useState();
  
  useEffect(() => {
    Axios.get("/blog/getDataWithAccount")
      .then( async res => {
        await setArr(res.result);
      }).catch(err => {
        console.log({err});
        route.push("/login")
      })
  }, []);

  const deleteDataBlog = (id, tag) => {
    const dl = {
      idDelete: id,
      nhan: tag
    };
    Axios.deleteTwo(`/blog/deleted`, dl)
      .then(res => {
        setArr(res.result)
      }).catch(err => {
        console.log({err});
      })
  }

  const updateBlog = (id) => {
    auth.update(true, id);
    route.push("/editor")
  }

  return (
    <BaseLayout title="Admin page">
      <h2 className={css.tieude}>Trang quản lý bài viết</h2>
      <div className={css.adContent}>
        <table className={css.adContent__table}>
            <thead>
              <tr className={css.adContent__table__tieude}>
                <th className={css.adContent__table__tieude__con}>STT</th>
                <th className={css.adContent__table__tieude__con}>Tiêu đề</th>
                <th className={css.adContent__table__tieude__con}>Trích dẫn</th>
                <th className={css.adContent__table__tieude__con}>Loại tin tức</th>
                <th className={css.adContent__table__tieude__con}>Ngày tạo</th>
                <th className={css.adContent__table__tieude__con}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {
                arr && arr.map((item, idx) => ( 
                  <tr className={css.adContent__table__noidung} key={idx}>
                    <td className={css.adContent__table__noidung__stt}>{++idx}</td>
                    <td className={css.adContent__table__noidung__con}>{item.title}</td>
                    <td className={css.adContent__table__noidung__con}>{item.description.length > 150 ? item.description.substr(0, 150)+"..." : item.description}</td>
                    <td className={css.adContent__table__noidung__con}>{item.tag}</td>
                    <td className={css.adContent__table__noidung__date}>{item.date}</td>
                    <td className={css.adContent__table__noidung__acction}>
                        <button className={css.adContent__table__noidung__acction__xoa} onClick={()=>deleteDataBlog(item.id, item.tag)}>Xóa</button>
                        <button className={css.adContent__table__noidung__acction__sua} onClick={()=> updateBlog(item.id)}>Sửa</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
        </table>
      </div>
    </BaseLayout>
  )
}

export default index;
