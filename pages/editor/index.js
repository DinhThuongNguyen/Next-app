import Image from "next/image";
import React, { useEffect, useState, useContext } from "react";
import { useRef } from "react";
import css from "./style.module.scss";
import BaseLayout from "../../components/Layouts/BaseLayout/BaseLayout";
import {
  FaLink,
  FaYoutube,
  FaFileImage,
  FaEgg,
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaAlignJustify,
} from "react-icons/fa";
import { AuthContext } from "../../ContextAPI/Auth-context";
import Axios from "../../Axios/methodApi";
import { useRouter } from "next/router";
const init = {
  url: "",
  alt: "",
  mota: "",
  width: "auto",
  height: "auto",
};

const objColor = [
  "black",
  "silver",
  "gray",
  "red",
  "fuchsia",
  "lime",
  "blue",
  "aqua",
  "orange",
  "aquamarine",
  "crimson",
  "darkcyan",
  "darkorange",
  "darkslategray",
  "gold",
  "lightgreen",
  "midnightblue",
  "thistle",
];

function Example_editor() {
  const route = useRouter();
  const auth = useContext(AuthContext);
  const [slt, setSlt] = useState();
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [font, setFont] = useState("Andika New Basic");
  const [fontSize, setFontSize] = useState(17);
  const [urlImage, setUrlImage] = useState("");
  const textEditor = useRef();
  const [valueContent, setValueContent] = useState({
    tieuDe: "",
    trichDan: "",
    nhanBaiViet: "",
  });
  const [showElement, setShowElement] = useState(0);
  const [formImage, setFormImage] = useState({
    url: "",
    alt: "",
    mota: "",
    width: "auto",
    height: "auto",
  });
  const [textUrl, setTextUrl] = useState("");
  const [idYoutube, setIDyoutube] = useState("");
  const [motaYT, setMoTaYT] = useState("");
  const [showYT, setShowYT] = useState(false);
  const [OBimages, setOBimages] = useState([]);
  const [error, setError] = useState("");
  const [Acolor, setColor] = useState(objColor[14]);
  const [textFind, setTextFind] = useState("");
  const [textYoutube, setTextYoutube] = useState("");

  function handleHTMLyoutube(e) {
    setTextYoutube(e.target.value);
  }
  function handleMoTa_youtube(e) {
    setMoTaYT(e.target.value);
  }
  function findLinkYT() {
    let arr;
    if ((arr = textYoutube.match(/(\?|&)v=([^&#]+)/))) {
      setIDyoutube(arr[2]);
    } else if ((arr = textYoutube.match(/(\.be\/)+([^\/]+)/))) {
      setIDyoutube(arr[2]);
    } else if ((arr = textYoutube.match(/(\embed\/)+([^\/]+)/))) {
      setIDyoutube(arr[2]);
    }
    setShowYT(true);
  }
  function pasteYThtml() {
    //f(slt && slt.commonAncestorContainer.ownerDocument.activeElement.id === "editor")
    if (
      (slt.endContainer.outerHTML &&
        slt.endContainer.outerHTML ===
          `<p style="text-align: left;" class="jsx-2414239523"><br class="jsx-2414239523"></p>`) ||
      `<p class="jsx-2414239523" style="text-align: left;"><br class="jsx-2414239523"></p>` ===
        slt.endContainer.outerHTML ||
      slt.endContainer.outerHTML ===
        `<p class="jsx-2414239523" style="text-align: left;"><br></p>` ||
      slt.endContainer.outerHTML ===
        `<p style="text-align: left;" class="jsx-2414239523"><br></p>`
    ) {
      const ytHTML = document.querySelector("iframe");
      const tagYT = document.createElement("div");
      tagYT.setAttribute("contenteditable", "false");
      tagYT.setAttribute("class", "youtube");
      const tagIframe = document.createElement("iframe");
      tagYT.innerHTML = ytHTML.outerHTML;
      const tagMoTa = document.createElement("p");
      tagMoTa.innerText = motaYT;
      tagYT.appendChild(tagMoTa);
      tagIframe.appendChild(tagYT);
      slt.endContainer.outerHTML =
        tagYT.outerHTML +
        `<p class="jsx-2414239523" style="text-align: left;"><br></p>`;
      setIDyoutube("");
      setTextYoutube("");
      setMoTaYT("");
      setShowYT(false);
    }
  }

  useEffect(() => {
    if (auth.TTupdate === true) {
      Axios.get(`/loadData/blog/${auth.idUpdate}`)
        .then(async (res) => {
          const dataUpdate = {
            tieuDe: res.result.title,
            trichDan: res.result.description,
            nhanBaiViet: res.result.tag,
          };
          await setValueContent(dataUpdate);
          const editor = document.getElementById("editor");
          editor.innerHTML = res.result.content;
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, []);

  function createPost() {
    const tagDiv = document.createElement("div");
    tagDiv.setAttribute("class", "Content-blog");0

    const editor = document.getElementById("editor");
    tagDiv.innerHTML = editor.innerHTML;
    const date = new Date();
    const newDate = `${date.getHours()}:${date.getMinutes()} ngày ${date.getDate()} tháng ${
      date.getMonth() + 1
    } năm ${date.getFullYear()}`;

    if (
      editor.innerHTML.length > 20 &&
      valueContent.tieuDe.length > 0 &&
      valueContent.trichDan.length > 0 &&
      valueContent.nhanBaiViet.length > 0
    ) {
      const formData = JSON.stringify({
        title: valueContent.tieuDe,
        description: valueContent.trichDan,
        content: tagDiv.outerHTML,
        tag: valueContent.nhanBaiViet,
        images: OBimages,
        date: newDate,
      });

      Axios.post("/blog/postBlog", formData)
        .then((res) => {
          setError("");
          route.push("/admin");
        })
        .catch((err) => {
          console.log({ err });
        });
    } else {
      setError("Không thể tạo bài viết");
    }
  }

  const updateBlog = () => {
    const editor = document.getElementById("editor");
    const formData = JSON.stringify({
      title: valueContent.tieuDe,
      description: valueContent.trichDan,
      tag: valueContent.nhanBaiViet,
      content: editor.innerHTML,
    });
    Axios.patch(`/blog/updateBlog/${auth.idUpdate}`, formData)
      .then((res) => {
        auth.update(false, null);
        route.push("/admin");
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  let bold_,
    italic_,
    underline_ = 0;
  function handelTypeText(type) {
    const sl = getSelection().toString();

    switch (type) {
      case "bold":
        bold_++;
        if (bold_ % 2 !== 0) {
          document.execCommand(type, false, sl);
        } else {
          document.execCommand(type, true, sl);
        }
        setBold(!bold);
        break;
      case "italic":
        italic_++;
        if (bold_ % 2 !== 0) {
          document.execCommand(type, false, sl);
        } else {
          document.execCommand(type, true, sl);
        }
        setItalic(!italic);
        break;
      case "underline":
        underline_++;
        if (bold_ % 2 !== 0) {
          document.execCommand(type, false, sl);
        } else {
          document.execCommand(type, true, sl);
        }
        setUnderline(!underline);
        break;
    }
  }
  function onKeyUp(e) {
    const editor = document.getElementById("editor");
    const selection = getSelection();
    setSlt(selection.getRangeAt(0));
    setTextFind(selection.toString());
    if (
      e.keyCode === 8 &&
      selection.getRangeAt(0).commonAncestorContainer.nodeName === "FIGURE"
    ) {
      const imgUpload = document.getElementsByClassName("imgUpload");
      imgUpload[imgUpload.length - 1].remove();
      editor.innerHTML += `<p class="jsx-2414239523" style="text-align: left;"><br class="jsx-2414239523"></p>`;
    }
  }
  function onkeyDow(e) {
    if (
      e.keyCode === 8 &&
      (editor.innerHTML ===
        `<p class="jsx-2414239523" style="text-align: left;"><br class="jsx-2414239523"></p>` ||
        editor.innerHTML ===
          `<p style="text-align: left;" class="jsx-2414239523"><br class="jsx-2414239523"></p>` ||
        editor.innerHTML ===
          `<p style="text-align: left;" class="jsx-2414239523"><br></p>` ||
        editor.innerHTML ===
          `<p class="jsx-2414239523" style="text-align: left;"><br class="jsx-2414239523"></p>` ||
        editor.innerHTML ===
          `<p class="jsx-2414239523" style="text-align: left;"><br></p>`)
    ) {
      e.preventDefault();
    } else if (e.keyCode === 8 && editor.innerHTML === "") {
      editor.innerHTML += `<p class="jsx-2414239523" style="text-align: left;"><br class="jsx-2414239523"></p>`;
    }
  }
  function handleChangeFont(e) {
    setFont(e.target.value);
  }
  function changeHeading(e) {
    document.execCommand("formatBlock", false, `${e.target.value}`);
  }
  function handleFontSize(e) {
    if (slt) {
      const str = slt.toString();
      const editor = document.getElementById("editor");
      if (str.length > 1) {
        const tagSpan = document.createElement("span");
        tagSpan.setAttribute("style", `font-size:${e.target.value}px;`);
        tagSpan.innerText = str + "&nbsp";
        const space = tagSpan.outerHTML + "&nbsp";
        const temp = editor.innerHTML.replace(str, space);
        editor.innerHTML = temp;
      } else {
        setFontSize(parseInt(e.target.value));
      }
    }
  }
  function addTagLink() {
    if (slt) {
      if (textFind.length > 0) {
        const str = `<span><a href=${textUrl} target="_blank">${textFind}</a></span>`;
        slt.endContainer.parentNode.innerHTML = slt.endContainer.parentNode.innerHTML.replace(
          textFind,
          str
        );
        // console.log(slt);
      } else {
        const str = `<span><a href=${textUrl} target="_blank">${textUrl}</a></span>`;
        slt.endContainer.parentNode.innerHTML += str;
      }
      setTextUrl("");
      // setTextFind("");
      setShowElement(0);
    }
  }

  function handleChangeFromAddUrl(e) {
    const { name, value } = e.target;
    setFormImage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function handelAddUrl(e) {
    setTextUrl(e.target.value);
  }
  function handleChangeFromComputer(e) {
    const { name, value } = e.target;
    setFormImage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function handleChangeValueContent(e) {
    const { name, value } = e.target;
    setValueContent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function addImageLink() {
    const tagDiv = document.createElement("div");
    tagDiv.setAttribute("class", "imgUpload");
    const tagImg = document.createElement("img");
    const tagFigcaption = document.createElement("figcaption");
    const tagFigure = document.createElement("figure");
    const text = document.createTextNode(formImage.mota);
    tagFigcaption.appendChild(text);
    tagImg.setAttribute("src", formImage.url);
    tagImg.setAttribute("width", formImage.width);
    tagImg.setAttribute("height", formImage.height);
    tagImg.setAttribute("alt", formImage.alt);
    tagImg.setAttribute("class", "mx-auto");

    tagFigure.appendChild(tagImg);
    tagFigure.appendChild(tagFigcaption);
    tagDiv.appendChild(tagFigure);

    setOBimages([
      ...OBimages,
      {
        id: OBimages.length,
        value: formImage.url,
      },
    ]);
    switch (slt.commonAncestorContainer.nodeName) {
      case "#text":
        slt.endContainer.parentElement.outerHTML =
          tagDiv.outerHTML +
          `<p style="text-align: left;" class="jsx-2414239523"><br class="jsx-2414239523"></p>`;
        break;
      case "P":
        slt.endContainer.outerHTML =
          tagDiv.outerHTML +
          `<p style="text-align: left;" class="jsx-2414239523"><br class="jsx-2414239523"></p>`;
        break;

      default:
        break;
    }
    setFormImage(init);
    setShowElement(0);
  }
  function handleValueFile(e) {
    if (e.currentTarget.files && e.currentTarget.files.length === 1) {
      const formData = new FormData();
      formData.append("image", e.currentTarget.files[0]);
      Axios.post("/image", formData)
        .then(async (res) => {
          setUrlImage(res.path);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  function addImageFromComputer() {
    const tagDiv = document.createElement("div");
    tagDiv.setAttribute("class", "imgUpload");
    const tagImg = document.createElement("img");
    const tagFigcaption = document.createElement("figcaption");
    const tagFigure = document.createElement("figure");
    const text = document.createTextNode(formImage.mota);
    tagFigcaption.appendChild(text);
    const url = urlImage;
    tagImg.setAttribute("src", url);
    tagImg.setAttribute("width", formImage.width);
    tagImg.setAttribute("height", formImage.height);
    tagImg.setAttribute("alt", formImage.alt);
    tagImg.setAttribute("class", "mx-auto");

    tagFigure.appendChild(tagImg);
    tagFigure.appendChild(tagFigcaption);
    tagDiv.appendChild(tagFigure);

    switch (slt.commonAncestorContainer.nodeName) {
      case "#text":
        slt.endContainer.parentElement.outerHTML =
          tagDiv.outerHTML +
          `<p style="text-align: left;" class="jsx-2414239523"><br class="jsx-2414239523"></p>`;
        break;
      case "P":
        slt.endContainer.outerHTML =
          tagDiv.outerHTML +
          `<p style="text-align: left;" class="jsx-2414239523"><br class="jsx-2414239523"></p>`;
        break;

      default:
        break;
    }

    setFormImage(init);
    setOBimages([
      ...OBimages,
      {
        id: OBimages.length,
        value: urlImage,
      },
    ]);
  }
  function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }

  function changeTextColor(mauchu) {
    const editor = document.getElementById("editor");
    if (editor) {
      const tagSpan = document.createElement("span");
      tagSpan.style.color = mauchu;
      tagSpan.innerText = textFind;
      slt.endContainer.parentNode.outerHTML = slt.endContainer.parentNode.outerHTML.replace(
        textFind,
        tagSpan.outerHTML
      );
    }
  }
  function ChangeBackgroundColor(maunen) {
    const tagDiv = document.createElement("div");
    tagDiv.style.width = "100%";
    tagDiv.style.backgroundColor = maunen;
    tagDiv.innerHTML = slt.commonAncestorContainer.parentElement.outerHTML;
    slt.commonAncestorContainer.parentElement.outerHTML = tagDiv.outerHTML;
  }

  function editorMouseUp() {
    const sll = getSelection();
    if (sll.anchorNode) setSlt(sll.getRangeAt(0));
    const sl = getSelection().toString();
    setTextFind(sl);
  }

  const controlText = (text) => {
    console.log(typeof slt.startContainer);
    if (slt) {
      switch (text) {
        case "trai":
          document.execCommand("justifyLeft");
          break;

        case "phai":
          document.execCommand("justifyRight");
          break;

        case "giua":
          document.execCommand("justifyCenter");
          break;

        case "deu":
          document.execCommand("justifyFull");
          break;

        default:
          break;
      }
    }
  };

  return auth.role === "admin" ? (
    <BaseLayout title="App blog">
      <main className="container">
        <div className="row">
          {/* {auth.adminLogin && ( */}
          <div className="col-md-10 col-sm-11 mx-auto">
            <div className={css.editor}>
              <h1 className="mb-3">
                <u>Tạo bài viết</u>
              </h1>
              <div className="form-group row">
                <label htmlFor="title" className="col-sm-2 col-form-label">
                  Tiêu đề
                </label>
                <div className="col-sm-10">
                  <textarea
                    className="form-control-plaintext"
                    id="txt"
                    row="3"
                    name="tieuDe"
                    onChange={handleChangeValueContent}
                    placeholder="Nhập nội dung"
                    value={valueContent.tieuDe}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="qoute" className="col-sm-2 col-form-label">
                  Trích dẫn bài viết
                </label>
                <div className="col-sm-10">
                  <textarea
                    className="form-control-plaintext"
                    rows="5"
                    name="trichDan"
                    onChange={handleChangeValueContent}
                    placeholder="Nhập nội dung"
                    value={valueContent.trichDan}
                  />
                </div>
              </div>
              <hr />
              <h4>
                <u>Nội dung bài viết</u>
              </h4>
              <div className={css.editor__one}>
                <div className={css.editor__one__control}>
                  <div className={css.editor__one__control__button}>
                    {/* <div className="ex-editor__one__control__button__heading"></div> */}
                    <div className={css.editor__one__control__button__word}>
                      <button
                        className={
                          bold ? css.typeText_active : css.buttonCharactor
                        }
                        onClick={() => handelTypeText("bold")}
                      >
                        <b>B</b>
                        <span className={css.typeText} style={{ width: 40 }}>
                          In đậm
                        </span>
                      </button>

                      <button
                        onClick={() => handelTypeText("italic")}
                        className={
                          italic ? css.typeText_active : css.buttonCharactor
                        }
                      >
                        <i>I</i>
                        <span className={css.typeText} style={{ width: 60 }}>
                          In nghiêng
                        </span>
                      </button>
                      <button
                        onClick={() => handelTypeText("underline")}
                        className={
                          underline ? css.typeText_active : css.buttonCharactor
                        }
                      >
                        <u>U</u>
                        <span className={css.typeText} style={{ width: 60 }}>
                          Gạch dưới
                        </span>
                      </button>
                    </div>
                    <div className={css.editor__one__control__button__heading}>
                      <span id={css.tagHeading}>Heading</span>
                      <select
                        multiple
                        name="heading"
                        id={css.heading}
                        onChange={changeHeading}
                      >
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="h5">Heading 5</option>
                        <option value="h6">Heading 6</option>
                      </select>
                    </div>
                    <div className={css.editor__one__control__button__font}>
                      <select
                        name="font"
                        id={css.font}
                        onChange={handleChangeFont}
                        defaultValue="Andika New Basic"
                      >
                        <option value="Poppins">Poppins</option>
                        <option value="Advent Pro">Noto Sans</option>
                        <option value="Hind Siliguri">Hin Siliguri</option>
                        <option value="Fredoka One">Fredoka One</option>
                        <option value="Andika New Basic">
                          Andika New Basic
                        </option>
                        <option value="M PLUS Rounded 1c">
                          M PLUS Rounded 1c
                        </option>
                        <option value="Charmonman">Charmonman</option>
                        <option value="Architects Daughter">
                          Architects Daughter
                        </option>
                        <option value="Rock Salt">Rock Salt</option>
                        <option value="Bad Script">Bad Script</option>
                      </select>
                      <span id={css.fontId}>Phông chữ </span>
                    </div>
                    <div className={css.editor__one__control__button__fontSize}>
                      <span>Font-size </span>
                      <select
                        name="fontSize"
                        id="fontSize"
                        defaultValue="17"
                        onChange={handleFontSize}
                      >
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                      </select>
                    </div>
                    <div
                      className={css.editor__one__control__button__textAlign}
                    >
                      <button onClick={() => controlText("trai")}>
                        <FaAlignLeft />
                      </button>
                      <button onClick={() => controlText("giua")}>
                        <FaAlignCenter />
                      </button>
                      <button onClick={() => controlText("phai")}>
                        <FaAlignRight />
                      </button>
                      <button onClick={() => controlText("deu")}>
                        <FaAlignJustify />
                      </button>
                    </div>
                    <div className={css.editor__one__control__button__icon}>
                      <button
                        data-toggle="modal"
                        data-target="#myModal"
                        onClick={() => setShowElement(2)}
                        className={css.buttonCharactor}
                      >
                        <FaLink />
                        <span className={css.typeText} style={{ width: 130 }}>
                          Chèn link liên kết
                        </span>
                      </button>

                      <button
                        data-toggle="modal"
                        data-target="#myModal"
                        onClick={() => setShowElement(1)}
                        className={css.buttonCharactor}
                      >
                        <FaFileImage />
                        <span className={css.typeText} style={{ width: 90 }}>
                          Chèn hình ảnh
                        </span>
                      </button>
                      <button
                        data-toggle="modal"
                        data-target="#myModal"
                        onClick={() => setShowElement(3)}
                        className={css.buttonCharactor}
                      >
                        <FaYoutube />
                        <span className={css.typeText} style={{ width: 120 }}>
                          Chèn video youtube
                        </span>
                      </button>
                      <button
                        data-toggle="modal"
                        data-target="#myModal"
                        onClick={() => setShowElement(4)}
                        className={css.buttonCharactor}
                      >
                        <h5 style={{ color: `${Acolor}` }}>A</h5>
                        <span className={css.typeText} style={{ width: 85 }}>
                          Màu văn bản
                        </span>
                      </button>
                      <button
                        data-toggle="modal"
                        data-target="#myModal"
                        onClick={() => setShowElement(5)}
                        className={css.buttonCharactor}
                      >
                        <FaEgg />
                        <span className={css.typeText} style={{ width: 110 }}>
                          Màu nền văn bản
                        </span>
                      </button>
                      <div className="modal fade" id="myModal">
                        <div className="modal-dialog">
                          {showElement === 1 && (
                            <div className="modal-content">
                              <div className="modal-header">
                                <h4 className="modal-title">Upload image</h4>
                              </div>
                              <div className="modal-body">
                                <div id="accordion">
                                  <div className="card">
                                    <div
                                      className="card-header"
                                      id="headingOne"
                                    >
                                      <h5 className="mb-0">
                                        <button
                                          className="btn btn-link"
                                          data-toggle="collapse"
                                          data-target="#collapseOne"
                                          aria-expanded="true"
                                          aria-controls="collapseOne"
                                        >
                                          Tải ảnh từ máy tính
                                        </button>
                                      </h5>
                                    </div>

                                    <div
                                      id="collapseOne"
                                      className="collapse show"
                                      aria-labelledby="headingOne"
                                      data-parent="#accordion"
                                    >
                                      <div className="card-body">
                                        <div className="form-row">
                                          <div className="col-md-6 mb-3">
                                            <label htmlFor="file">
                                              Add file
                                            </label>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="form-control"
                                              onChange={handleValueFile}
                                            />
                                          </div>
                                          <div className="col-md-3 mb-3">
                                            <label htmlFor="width">Width</label>
                                            <input
                                              type="text"
                                              name="width"
                                              className="form-control"
                                              onChange={
                                                handleChangeFromComputer
                                              }
                                            />
                                          </div>
                                          <div className="col-md-3 mb-3">
                                            <label htmlFor="height">
                                              Height
                                            </label>
                                            <input
                                              type="text"
                                              name="height"
                                              className="form-control"
                                              onChange={
                                                handleChangeFromComputer
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="form-row">
                                          <div className="col-md-4 mb-3">
                                            <label htmlFor="alt">ALT</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="alt"
                                              onChange={
                                                handleChangeFromComputer
                                              }
                                            />
                                          </div>
                                          <div className="col-md-8 mb-3">
                                            <label htmlFor="trichDan">
                                              Ghi chú ảnh
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="mota"
                                              onChange={
                                                handleChangeFromComputer
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="form-row">
                                          <div className="col mb-3">
                                            <div
                                              className={`${css.imgDesktop} mx-auto`}
                                            >
                                              <div
                                                className={css.imgDesktop__show}
                                              >
                                                <Image
                                                  src={urlImage.includes("https") ? urlImage : `/${urlImage}`}
                                                  alt="anh desktop"
                                                  layout="fill"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          className="button btn btn-dark"
                                          data-dismiss="modal"
                                          onClick={addImageFromComputer}
                                          disabled={
                                            formImage.alt.length >= 4
                                              ? false
                                              : true
                                          }
                                        >
                                          Add image
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="card">
                                    <div
                                      className="card-header"
                                      id="headingTwo"
                                    >
                                      <h5 className="mb-0">
                                        <button
                                          className="btn btn-link collapsed"
                                          data-toggle="collapse"
                                          data-target="#collapseTwo"
                                          aria-expanded="false"
                                          aria-controls="collapseTwo"
                                        >
                                          Nhập link ảnh
                                        </button>
                                      </h5>
                                    </div>
                                    <div
                                      id="collapseTwo"
                                      className="collapse"
                                      aria-labelledby="headingTwo"
                                      data-parent="#accordion"
                                    >
                                      <div className="card-body">
                                        <div className="form-group">
                                          <label htmlFor="inputAddress">
                                            URL
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter url"
                                            name="url"
                                            value={formImage.url}
                                            onChange={handleChangeFromAddUrl}
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label htmlFor="inputAddress">
                                            Mô tả ảnh
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập mô tả ảnh"
                                            name="mota"
                                            value={formImage.mota}
                                            onChange={handleChangeFromAddUrl}
                                            id="validationDefault02"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label htmlFor="inputAddress2">
                                            Alt
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter alt"
                                            name="alt"
                                            value={formImage.alt}
                                            onChange={handleChangeFromAddUrl}
                                            id="validationDefault03"
                                            required
                                          />
                                        </div>

                                        <div className="form-row">
                                          <div className="form-group col-md-6">
                                            <label htmlFor="inputEmail4">
                                              Width
                                            </label>
                                            <input
                                              type="number"
                                              min="1"
                                              max="5000"
                                              className="form-control"
                                              placeholder="width"
                                              name="width"
                                              onChange={handleChangeFromAddUrl}
                                              id="validationDefault04"
                                              required
                                            />
                                          </div>
                                          <div className="form-group col-md-6">
                                            <label htmlFor="inputPassword4">
                                              Height
                                            </label>
                                            <input
                                              type="number"
                                              min="1"
                                              max="5000"
                                              className="form-control"
                                              placeholder="height"
                                              name="height"
                                              onChange={handleChangeFromAddUrl}
                                              id="validationDefault05"
                                              required
                                            />
                                          </div>
                                        </div>
                                        <button
                                          className="btn btn-primary"
                                          data-dismiss="modal"
                                          onClick={addImageLink}
                                          disabled={
                                            formImage.url.length > 0 &&
                                            formImage.alt.length >= 3
                                              ? false
                                              : true
                                          }
                                        >
                                          Add image
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {showElement === 2 && (
                            <div className="modal-content ">
                              <div className="modal-header">
                                <button
                                  className="close"
                                  data-dismiss="modal"
                                  onClick={() => setShowElement(0)}
                                >
                                  &times;
                                </button>
                              </div>
                              <div className="modal-body">
                                <div className="form-group"></div>
                                <div className="form-group">
                                  <input
                                    placeholder="Nhập hoặc dán url"
                                    name="textUrl"
                                    value={textUrl}
                                    type="text"
                                    className="form-control"
                                    onChange={handelAddUrl}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  data-dismiss="modal"
                                  onClick={addTagLink}
                                  disabled={textUrl.length > 5 ? false : true}
                                >
                                  Add url
                                </button>
                              </div>
                            </div>
                          )}
                          {showElement === 4 && (
                            <div className="modal-content ">
                              <div className="modal-body">
                                <div className={css.boxColor}>
                                  {objColor.map((item, idx) => (
                                    <span
                                      key={idx}
                                      className={css.boxColor__item}
                                      data-dismiss="modal"
                                      onClick={() => changeTextColor(item)}
                                      style={{
                                        backgroundColor: item,
                                      }}
                                    ></span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {showElement === 5 && (
                            <div className="modal-content ">
                              <div className="modal-body">
                                <div className={css.boxColor}>
                                  {objColor.map((item, idx) => (
                                    <span
                                      key={idx}
                                      className={css.boxColor__item}
                                      data-dismiss="modal"
                                      onClick={() =>
                                        ChangeBackgroundColor(item)
                                      }
                                      style={{
                                        backgroundColor: item,
                                      }}
                                    ></span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {showElement === 3 && (
                            <div className="modal-content">
                              <div className="modal-header">
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    value={textYoutube}
                                    className="form-control"
                                    placeholder="Nhập link youtube"
                                    onChange={handleHTMLyoutube}
                                  />
                                  <div className="input-group-append">
                                    <button
                                      className="btn btn-success"
                                      onClick={findLinkYT}
                                    >
                                      find
                                    </button>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="modal"
                                >
                                  &times;
                                </button>
                              </div>

                              <div className="modal-body">
                                {showYT && (
                                  <iframe
                                    width="100%"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${idYoutube}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                )}
                              </div>

                              <div className="modal-footer">
                                <div
                                  className="form-group"
                                  style={{ width: "100%" }}
                                >
                                  <label>Mô tả video</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập mô tả"
                                    id="mota"
                                    value={motaYT}
                                    onChange={handleMoTa_youtube}
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  data-dismiss="modal"
                                  onClick={pasteYThtml}
                                  disabled={motaYT.length > 5 ? false : true}
                                >
                                  Paste
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={css.editor__two}>
                <div>
                  <div
                    ref={textEditor}
                    onKeyUp={onKeyUp}
                    onKeyDown={onkeyDow}
                    id="editor"
                    onPaste={handlePaste}
                    onMouseUp={editorMouseUp}
                    role="textbox"
                    className="fontText richEditor"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                  >
                    <p style={{ textAlign: "left" }}>
                      <br />
                    </p>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="tag" className="col-sm-2 col-form-label">
                  Nhãn bài viết
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control-plaintext"
                    name="nhanBaiViet"
                    onChange={handleChangeValueContent}
                    placeholder="Nhãn bài viết"
                    value={valueContent.nhanBaiViet}
                  />
                </div>
              </div>
              {error.length > 0 && <p style={{ color: "red" }}>{error}</p>}

              {auth.TTupdate === false ? (
                <button className="btn btn-danger" onClick={createPost}>
                  Tạo bài viết mới
                </button>
              ) : (
                <button className="btn btn-danger" onClick={updateBlog}>
                  Sửa bài viết
                </button>
              )}
            </div>
          </div>
          {/* )} */}
        </div>
        <style jsx>
          {`
            .fontText {
              width: 100%;
              font-family: ${font}, sans-serif;
              font-size: ${fontSize}px;
              color: #0b0c0c;
              background-color: #ffffff;
              margin-bottom: 2rem;
              border: 1px solid;
              word-spacing: -1px;
            }
          `}
        </style>
      </main>
    </BaseLayout>
  ) : (
    <BaseLayout title="Không tìm thấy trang">
      <h2>Bạn không có quyền truy cập đến trang này</h2>
    </BaseLayout>
  );
}

export default Example_editor;
