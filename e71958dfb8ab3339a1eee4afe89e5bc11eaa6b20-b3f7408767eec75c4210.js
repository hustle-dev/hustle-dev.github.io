(self.webpackChunkhustle_dev_blog=self.webpackChunkhustle_dev_blog||[]).push([[194],{1365:function(e){"use strict";const t=/[\p{Lu}]/u,n=/[\p{Ll}]/u,r=/^[\p{Lu}](?![\p{Lu}])/gu,a=/([\p{Alpha}\p{N}_]|$)/u,i=/[_.\- ]+/,s=new RegExp("^"+i.source),o=new RegExp(i.source+a.source,"gu"),l=new RegExp("\\d+"+a.source,"gu"),c=(e,a)=>{if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");if(a={pascalCase:!1,preserveConsecutiveUppercase:!1,...a},0===(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim()).length)return"";const i=!1===a.locale?e=>e.toLowerCase():e=>e.toLocaleLowerCase(a.locale),c=!1===a.locale?e=>e.toUpperCase():e=>e.toLocaleUpperCase(a.locale);if(1===e.length)return a.pascalCase?c(e):i(e);return e!==i(e)&&(e=((e,r,a)=>{let i=!1,s=!1,o=!1;for(let l=0;l<e.length;l++){const c=e[l];i&&t.test(c)?(e=e.slice(0,l)+"-"+e.slice(l),i=!1,o=s,s=!0,l++):s&&o&&n.test(c)?(e=e.slice(0,l-1)+"-"+e.slice(l-1),o=s,s=!1,i=!0):(i=r(c)===c&&a(c)!==c,o=s,s=a(c)===c&&r(c)!==c)}return e})(e,i,c)),e=e.replace(s,""),e=a.preserveConsecutiveUppercase?((e,t)=>(r.lastIndex=0,e.replace(r,(e=>t(e)))))(e,i):i(e),a.pascalCase&&(e=c(e.charAt(0))+e.slice(1)),((e,t)=>(o.lastIndex=0,l.lastIndex=0,e.replace(o,((e,n)=>t(n))).replace(l,(e=>t(e)))))(e,c)};e.exports=c,e.exports.default=c},3388:function(e,t,n){var r=n(7049);function a(e){return r.createElement("svg",e,[r.createElement("g",{clipPath:"url(#clip0_30_1176)",key:0},r.createElement("path",{d:"M26.9999 24.363L15.8624 35.5005L12.6809 32.319L26.9999 18L41.3189 32.319L38.1374 35.5005L26.9999 24.363Z",fill:"white"})),r.createElement("defs",{key:1},r.createElement("clipPath",{id:"clip0_30_1176"},r.createElement("rect",{width:"54",height:"54",fill:"white"})))])}a.defaultProps={width:"54",height:"54",viewBox:"0 0 54 54",fill:"none",className:"my-class"},e.exports=a,a.default=a},7561:function(e,t,n){var r=n(7049);function a(e){return r.createElement("svg",e,r.createElement("path",{d:"M13.375 1H10C8.50816 1 7.07742 1.59263 6.02252 2.64752C4.96763 3.70242 4.375 5.13316 4.375 6.625V10H1V14.5H4.375V23.5H8.875V14.5H12.25L13.375 10H8.875V6.625C8.875 6.32663 8.99353 6.04048 9.2045 5.82951C9.41548 5.61853 9.70163 5.5 10 5.5H13.375V1Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"}))}a.defaultProps={width:"15",height:"25",viewBox:"0 0 15 25",fill:"none",className:"my-class"},e.exports=a,a.default=a},7194:function(e,t,n){var r=n(7049);function a(e){return r.createElement("svg",e,r.createElement("path",{d:"M7.10256 17.2892C2.74359 18.6446 2.74359 15.0302 1 14.5783M13.2051 20V16.503C13.2378 16.0722 13.1817 15.639 13.0404 15.2324C12.8991 14.8257 12.6759 14.4549 12.3856 14.1446C15.1231 13.8284 18 12.7531 18 7.81935C17.9998 6.55776 17.5316 5.34454 16.6923 4.43082C17.0897 3.32706 17.0616 2.10705 16.6138 1.02421C16.6138 1.02421 15.5851 0.707947 13.2051 2.36155C11.207 1.80025 9.10071 1.80025 7.10256 2.36155C4.72256 0.707947 3.69385 1.02421 3.69385 1.02421C3.24607 2.10705 3.21797 3.32706 3.61538 4.43082C2.76985 5.35132 2.30117 6.5755 2.30769 7.84646C2.30769 12.744 5.18462 13.8193 7.92205 14.1717C7.63523 14.4789 7.41402 14.8453 7.27283 15.2469C7.13164 15.6486 7.07363 16.0766 7.10256 16.503V20",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"}))}a.defaultProps={width:"19",height:"21",viewBox:"0 0 19 21",fill:"none",className:"my-class"},e.exports=a,a.default=a},3188:function(e,t,n){var r=n(7049);function a(e){return r.createElement("svg",e,[r.createElement("path",{d:"M16.6667 8.33301C18.3244 8.33301 19.9141 8.99149 21.0862 10.1636C22.2583 11.3357 22.9167 12.9254 22.9167 14.583V21.8747H18.7501V14.583C18.7501 14.0305 18.5306 13.5006 18.1399 13.1099C17.7492 12.7192 17.2193 12.4997 16.6667 12.4997C16.1142 12.4997 15.5843 12.7192 15.1936 13.1099C14.8029 13.5006 14.5834 14.0305 14.5834 14.583V21.8747H10.4167V14.583C10.4167 12.9254 11.0752 11.3357 12.2473 10.1636C13.4194 8.99149 15.0091 8.33301 16.6667 8.33301Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:0}),r.createElement("path",{d:"M6.24992 9.375H2.08325V21.875H6.24992V9.375Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:1}),r.createElement("path",{d:"M4.16659 6.24967C5.31718 6.24967 6.24992 5.31693 6.24992 4.16634C6.24992 3.01575 5.31718 2.08301 4.16659 2.08301C3.01599 2.08301 2.08325 3.01575 2.08325 4.16634C2.08325 5.31693 3.01599 6.24967 4.16659 6.24967Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:2})])}a.defaultProps={width:"25",height:"25",viewBox:"0 0 25 25",fill:"none",className:"my-class"},e.exports=a,a.default=a},8120:function(e,t,n){var r=n(7049);function a(e){return r.createElement("svg",e,[r.createElement("path",{d:"M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:0}),r.createElement("path",{d:"M22 6L12 13L2 6",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:1})])}a.defaultProps={width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",className:"my-class"},e.exports=a,a.default=a},223:function(e,t,n){"use strict";n.d(t,{G:function(){return H},L:function(){return f},M:function(){return C},P:function(){return k},S:function(){return q},_:function(){return o},a:function(){return s},b:function(){return h},d:function(){return u},g:function(){return p},h:function(){return l}});var r=n(7049),a=(n(1365),n(337)),i=n.n(a);function s(){return s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s.apply(this,arguments)}function o(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t.indexOf(n=i[r])>=0||(a[n]=e[n]);return a}const l=()=>"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;const c=e=>{var t;return(e=>{var t,n;return Boolean(null==e||null==(t=e.images)||null==(n=t.fallback)?void 0:n.src)})(e)?e:(e=>Boolean(null==e?void 0:e.gatsbyImageData))(e)?e.gatsbyImageData:(e=>Boolean(null==e?void 0:e.gatsbyImage))(e)?e.gatsbyImage:null==e||null==(t=e.childImageSharp)?void 0:t.gatsbyImageData},u=e=>{var t,n,r;return null==(t=c(e))||null==(n=t.images)||null==(r=n.fallback)?void 0:r.src};function d(e,t,n){const r={};let a="gatsby-image-wrapper";return"fixed"===n?(r.width=e,r.height=t):"constrained"===n&&(a="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:a,"data-gatsby-image-wrapper":"",style:r}}function h(e,t,n,r,a){return void 0===a&&(a={}),s({},n,{loading:r,shouldLoad:e,"data-main-image":"",style:s({},a,{opacity:t?1:0})})}function p(e,t,n,r,a,i,o,l){const c={};i&&(c.backgroundColor=i,"fixed"===n?(c.width=r,c.height=a,c.backgroundColor=i,c.position="relative"):("constrained"===n||"fullWidth"===n)&&(c.position="absolute",c.top=0,c.left=0,c.bottom=0,c.right=0)),o&&(c.objectFit=o),l&&(c.objectPosition=l);const u=s({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:s({opacity:t?0:1,transition:"opacity 500ms linear"},c)});return u}const m=["children"],g=function(e){let{layout:t,width:n,height:a}=e;return"fullWidth"===t?r.createElement("div",{"aria-hidden":!0,style:{paddingTop:a/n*100+"%"}}):"constrained"===t?r.createElement("div",{style:{maxWidth:n,display:"block"}},r.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:`data:image/svg+xml;charset=utf-8,%3Csvg%20height='${a}'%20width='${n}'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E`,style:{maxWidth:"100%",display:"block",position:"static"}})):null},f=function(e){let{children:t}=e,n=o(e,m);return r.createElement(r.Fragment,null,r.createElement(g,s({},n)),t,null)},y=["src","srcSet","loading","alt","shouldLoad"],b=["fallback","sources","shouldLoad"],v=function(e){let{src:t,srcSet:n,loading:a,alt:i="",shouldLoad:l}=e,c=o(e,y);return r.createElement("img",s({},c,{decoding:"async",loading:a,src:l?t:void 0,"data-src":l?void 0:t,srcSet:l?n:void 0,"data-srcset":l?void 0:n,alt:i}))},w=function(e){let{fallback:t,sources:n=[],shouldLoad:a=!0}=e,i=o(e,b);const l=i.sizes||(null==t?void 0:t.sizes),c=r.createElement(v,s({},i,t,{sizes:l,shouldLoad:a}));return n.length?r.createElement("picture",null,n.map((e=>{let{media:t,srcSet:n,type:i}=e;return r.createElement("source",{key:`${t}-${i}-${n}`,type:i,media:t,srcSet:a?n:void 0,"data-srcset":a?void 0:n,sizes:l})})),c):c};var x;v.propTypes={src:a.string.isRequired,alt:a.string.isRequired,sizes:a.string,srcSet:a.string,shouldLoad:a.bool},w.displayName="Picture",w.propTypes={alt:a.string.isRequired,shouldLoad:a.bool,fallback:a.exact({src:a.string.isRequired,srcSet:a.string,sizes:a.string}),sources:a.arrayOf(a.oneOfType([a.exact({media:a.string.isRequired,type:a.string,sizes:a.string,srcSet:a.string.isRequired}),a.exact({media:a.string,type:a.string.isRequired,sizes:a.string,srcSet:a.string.isRequired})]))};const j=["fallback"],k=function(e){let{fallback:t}=e,n=o(e,j);return t?r.createElement(w,s({},n,{fallback:{src:t},"aria-hidden":!0,alt:""})):r.createElement("div",s({},n))};k.displayName="Placeholder",k.propTypes={fallback:a.string,sources:null==(x=w.propTypes)?void 0:x.sources,alt:function(e,t,n){return e[t]?new Error(`Invalid prop \`${t}\` supplied to \`${n}\`. Validation failed.`):null}};const C=function(e){return r.createElement(r.Fragment,null,r.createElement(w,s({},e)),r.createElement("noscript",null,r.createElement(w,s({},e,{shouldLoad:!0}))))};C.displayName="MainImage",C.propTypes=w.propTypes;const E=["as","className","class","style","image","loading","imgClassName","imgStyle","backgroundColor","objectFit","objectPosition"],L=["style","className"],S=e=>e.replace(/\n/g,""),N=function(e,t,n){for(var r=arguments.length,a=new Array(r>3?r-3:0),s=3;s<r;s++)a[s-3]=arguments[s];return e.alt||""===e.alt?i().string.apply(i(),[e,t,n].concat(a)):new Error(`The "alt" prop is required in ${n}. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html`)},A={image:i().object.isRequired,alt:N},T=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],I=["style","className"],P=new Set;let _,O;const $=function(e){let{as:t="div",image:a,style:i,backgroundColor:c,className:u,class:h,onStartLoad:p,onLoad:m,onError:g}=e,f=o(e,T);const{width:y,height:b,layout:v}=a,w=d(y,b,v),{style:x,className:j}=w,k=o(w,I),C=(0,r.useRef)(),E=(0,r.useMemo)((()=>JSON.stringify(a.images)),[a.images]);h&&(u=h);const L=function(e,t,n){let r="";return"fullWidth"===e&&(r=`<div aria-hidden="true" style="padding-top: ${n/t*100}%;"></div>`),"constrained"===e&&(r=`<div style="max-width: ${t}px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg%20height='${n}'%20width='${t}'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E" style="max-width: 100%; display: block; position: static;"></div>`),r}(v,y,b);return(0,r.useEffect)((()=>{_||(_=n.e(998).then(n.bind(n,998)).then((e=>{let{renderImageToString:t,swapPlaceholderImage:n}=e;return O=t,{renderImageToString:t,swapPlaceholderImage:n}})));const e=C.current.querySelector("[data-gatsby-image-ssr]");if(e&&l())return e.complete?(null==p||p({wasCached:!0}),null==m||m({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)):(null==p||p({wasCached:!0}),e.addEventListener("load",(function t(){e.removeEventListener("load",t),null==m||m({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)}))),void P.add(E);if(O&&P.has(E))return;let t,r;return _.then((e=>{let{renderImageToString:n,swapPlaceholderImage:o}=e;C.current&&(C.current.innerHTML=n(s({isLoading:!0,isLoaded:P.has(E),image:a},f)),P.has(E)||(t=requestAnimationFrame((()=>{C.current&&(r=o(C.current,E,P,i,p,m,g))}))))})),()=>{t&&cancelAnimationFrame(t),r&&r()}}),[a]),(0,r.useLayoutEffect)((()=>{P.has(E)&&O&&(C.current.innerHTML=O(s({isLoading:P.has(E),isLoaded:P.has(E),image:a},f)),null==p||p({wasCached:!0}),null==m||m({wasCached:!0}))}),[a]),(0,r.createElement)(t,s({},k,{style:s({},x,i,{backgroundColor:c}),className:`${j}${u?` ${u}`:""}`,ref:C,dangerouslySetInnerHTML:{__html:L},suppressHydrationWarning:!0}))},H=(0,r.memo)((function(e){return e.image?(0,r.createElement)($,e):null}));H.propTypes=A,H.displayName="GatsbyImage";const V=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"];function W(e){return function(t){let{src:n,__imageData:a,__error:i}=t,l=o(t,V);return i&&console.warn(i),a?r.createElement(e,s({image:a},l)):(console.warn("Image not loaded",n),null)}}const F=W((function(e){let{as:t="div",className:n,class:a,style:i,image:l,loading:c="lazy",imgClassName:u,imgStyle:m,backgroundColor:g,objectFit:y,objectPosition:b}=e,v=o(e,E);if(!l)return console.warn("[gatsby-plugin-image] Missing image prop"),null;a&&(n=a),m=s({objectFit:y,objectPosition:b,backgroundColor:g},m);const{width:w,height:x,layout:j,images:N,placeholder:A,backgroundColor:T}=l,I=d(w,x,j),{style:P,className:_}=I,O=o(I,L),$={fallback:void 0,sources:[]};return N.fallback&&($.fallback=s({},N.fallback,{srcSet:N.fallback.srcSet?S(N.fallback.srcSet):void 0})),N.sources&&($.sources=N.sources.map((e=>s({},e,{srcSet:S(e.srcSet)})))),r.createElement(t,s({},O,{style:s({},P,i,{backgroundColor:g}),className:`${_}${n?` ${n}`:""}`}),r.createElement(f,{layout:j,width:w,height:x},r.createElement(k,s({},p(A,!1,j,w,x,T,y,b))),r.createElement(C,s({"data-gatsby-image-ssr":"",className:u},v,h("eager"===c,!1,$,c,m)))))})),M=function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),a=2;a<n;a++)r[a-2]=arguments[a];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?i().number.apply(i(),[e,t].concat(r)):new Error(`"${t}" ${e[t]} may not be passed when layout is fullWidth.`)},R=new Set(["fixed","fullWidth","constrained"]),B={src:i().string.isRequired,alt:N,width:M,height:M,sizes:i().string,layout:e=>{if(void 0!==e.layout&&!R.has(e.layout))return new Error(`Invalid value ${e.layout}" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".`)}};F.displayName="StaticImage",F.propTypes=B;const q=W(H);q.displayName="StaticImage",q.propTypes=B},4485:function(e,t,n){"use strict";n.d(t,{Tv:function(){return l},dq:function(){return u},PP:function(){return E},pQ:function(){return S},Vp:function(){return N}});var r=n(1664),a=n(3388),i=n.n(a),s=n(7049);var o=n(5366);const l=()=>{const{isVisible:e,scrollToTop:t}=(()=>{const{0:e,1:t}=(0,s.useState)(!1),n=()=>{const e=window.scrollY;t(e>200)};return(0,s.useEffect)((()=>(window.addEventListener("scroll",n),()=>{window.removeEventListener("scroll",n)})),[]),{isVisible:e,scrollToTop:()=>{window.scrollTo({top:0,behavior:"smooth"})}}})();return(0,o.jsx)("button",{className:(0,r.Z)("FloatingButton-module--floatingButton--8fc0b",{"FloatingButton-module--visible--e951f":e}),onClick:t,children:(0,o.jsx)(i(),{})})};var c=n(5026);const u=()=>{const e=(0,s.useRef)(null),{theme:t}=(0,c.Fg)();return(0,s.useEffect)((()=>{if(null===e.current)return;const n=e.current,r=document.createElement("script");return r.src="https://giscus.app/client.js",r.setAttribute("data-repo","hustle-dev/hustle-dev.github.io"),r.setAttribute("data-repo-id","R_kgDOJUJ_0Q"),r.setAttribute("data-category","Comments"),r.setAttribute("data-category-id","DIC_kwDOJUJ_0c4CVoHk"),r.setAttribute("data-mapping","og:title"),r.setAttribute("data-strict","0"),r.setAttribute("data-reactions-enabled","1"),r.setAttribute("data-emit-metadata","0"),r.setAttribute("data-input-position","bottom"),r.setAttribute("data-theme",t===c.Q2.LIGHT?"light":"https://cdn.jsdelivr.net/gh/hustle-dev/hustle-dev.github.io@main/src/components/Giscus/custom-giscus-theme.css"),r.setAttribute("data-lang","ko"),r.setAttribute("crossorigin","anonymous"),r.async=!0,n.appendChild(r),()=>{null!==n&&n.removeChild(r)}}),[t]),(0,o.jsx)("div",{id:"comment",ref:e})};var d=n(223),h=n(1692);const p=e=>{let{className:t}=e;return(0,o.jsx)("p",{className:(0,r.Z)("Description-module--description--0320c",t),children:"It is possible for ordinary people to choose to be extraordinary."})};const m=e=>{let{text:t}=e;return(0,o.jsx)("h1",{className:"Heading-module--name--fe536",children:t})};var g=n(7561),f=n.n(g),y=n(7194),b=n.n(y),v=n(3188),w=n.n(v),x=n(8120),j=n.n(x);const k=e=>{let{href:t,children:n}=e;return(0,o.jsx)("a",{href:t,target:"_blank",className:"IconWrapper-module--profileIcon--6cfc9",rel:"noreferrer",children:n})},C=()=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(k,{href:"mailto:dlwoabsdk@gmail.com",children:(0,o.jsx)(j(),{})}),(0,o.jsx)(k,{href:"https://www.facebook.com/jeongminiminimini/",children:(0,o.jsx)(f(),{})}),(0,o.jsx)(k,{href:"https://www.linkedin.com/in/jeongmin-lee-5ab898202/",children:(0,o.jsx)(w(),{})}),(0,o.jsx)(k,{href:"https://github.com/hustle-dev",children:(0,o.jsx)(b(),{})})]});const E=e=>{let{pathname:t}=e;const r=t.includes("/posts/");return(0,h.EQ)(r).with(!0,(()=>(0,o.jsxs)("div",{className:"ProfileCard-module--wrapper--edfc1",children:[(0,o.jsx)(d.S,{src:"../../images/elon.jpeg",alt:"일론 머스크",objectFit:"fill",className:"ProfileCard-module--postProfileImage--4a121",width:100,height:100,__imageData:n(7863)}),(0,o.jsxs)("div",{children:[(0,o.jsx)(m,{text:"Hustle-dev"}),(0,o.jsx)(p,{className:"ProfileCard-module--postDescription--7d431"}),(0,o.jsx)("div",{className:"ProfileCard-module--iconWrapper--d0fd6",children:(0,o.jsx)(C,{})})]})]}))).with(!1,(()=>(0,o.jsxs)("div",{className:"ProfileCard-module--card--3d81d",children:[(0,o.jsx)(m,{text:"Hustle-devlog"}),(0,o.jsx)(p,{}),(0,o.jsxs)("div",{className:"ProfileCard-module--info--32e1d",children:[(0,o.jsx)(d.S,{src:"../../images/elon.jpeg",alt:"일론 머스크",className:"ProfileCard-module--profileImage--4692c",width:100,height:100,__imageData:n(7863)}),(0,o.jsx)(C,{})]})]}))).exhaustive()};var L=n(2955);const S=e=>{let{title:t,description:n,heroImage:r,pathname:a,children:i}=e;const s=(0,L.useStaticQuery)("1485575810"),{title:l,description:c,siteUrl:u}=s.site.siteMetadata,{publicURL:d}=s.file,h={title:t||l,description:n||c,url:`${u}${a||""}`,image:`${u}${r||d}`};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("title",{children:h.title}),(0,o.jsx)("link",{rel:"canonical",href:h.url}),(0,o.jsx)("meta",{name:"description",content:h.description}),(0,o.jsx)("meta",{name:"image",content:h.image}),(0,o.jsx)("meta",{property:"og:title",content:h.title}),(0,o.jsx)("meta",{property:"og:description",content:h.description}),(0,o.jsx)("meta",{property:"og:type",content:"blog"}),(0,o.jsx)("meta",{property:"og:url",content:h.url}),(0,o.jsx)("meta",{property:"og:image",content:h.image}),(0,o.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,o.jsx)("meta",{name:"twitter:title",content:h.title}),(0,o.jsx)("meta",{name:"twitter:description",content:h.description}),(0,o.jsx)("meta",{property:"twitter:image",content:h.image}),i]})};const N=e=>{let{name:t,className:n}=e;return(0,o.jsx)("div",{className:(0,r.Z)("Tag-module--tag--55cfc",n),children:(0,o.jsx)("span",{children:t})})}},1664:function(e,t,n){"use strict";function r(e){var t,n,a="";if("string"==typeof e||"number"==typeof e)a+=e;else if("object"==typeof e)if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=r(e[t]))&&(a&&(a+=" "),a+=n)}else for(n in e)e[n]&&(a&&(a+=" "),a+=n);return a}t.Z=function(){for(var e,t,n=0,a="",i=arguments.length;n<i;n++)(e=arguments[n])&&(t=r(e))&&(a&&(a+=" "),a+=t);return a}},1692:function(e,t,n){"use strict";n.d(t,{EQ:function(){return C}});const r=Symbol.for("@ts-pattern/matcher"),a=Symbol.for("@ts-pattern/isVariadic"),i="@ts-pattern/anonymous-select-key",s=e=>Boolean(e&&"object"==typeof e),o=e=>e&&!!e[r],l=(e,t,n)=>{if(o(e)){const a=e[r](),{matched:i,selections:s}=a.match(t);return i&&s&&Object.keys(s).forEach((e=>n(e,s[e]))),i}if(s(e)){if(!s(t))return!1;if(Array.isArray(e)){if(!Array.isArray(t))return!1;let r=[],i=[],s=[];for(const t of e.keys()){const n=e[t];o(n)&&n[a]?s.push(n):s.length?i.push(n):r.push(n)}if(s.length){if(s.length>1)throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");if(t.length<r.length+i.length)return!1;const e=t.slice(0,r.length),a=0===i.length?[]:t.slice(-i.length),o=t.slice(r.length,0===i.length?1/0:-i.length);return r.every(((t,r)=>l(t,e[r],n)))&&i.every(((e,t)=>l(e,a[t],n)))&&(0===s.length||l(s[0],o,n))}return e.length===t.length&&e.every(((e,r)=>l(e,t[r],n)))}return Object.keys(e).every((a=>{const i=e[a];return(a in t||o(s=i)&&"optional"===s[r]().matcherType)&&l(i,t[a],n);var s}))}return Object.is(t,e)},c=e=>{var t,n,a;return s(e)?o(e)?null!=(t=null==(n=(a=e[r]()).getSelectionKeys)?void 0:n.call(a))?t:[]:Array.isArray(e)?u(e,c):u(Object.values(e),c):[]},u=(e,t)=>e.reduce(((e,n)=>e.concat(t(n))),[]);function d(e){return Object.assign(e,{optional:()=>h(e),and:t=>p(e,t),or:t=>m(e,t),select:t=>void 0===t?f(e):f(t,e)})}function h(e){return d({[r]:()=>({match:t=>{let n={};const r=(e,t)=>{n[e]=t};return void 0===t?(c(e).forEach((e=>r(e,void 0))),{matched:!0,selections:n}):{matched:l(e,t,r),selections:n}},getSelectionKeys:()=>c(e),matcherType:"optional"})})}function p(...e){return d({[r]:()=>({match:t=>{let n={};const r=(e,t)=>{n[e]=t};return{matched:e.every((e=>l(e,t,r))),selections:n}},getSelectionKeys:()=>u(e,c),matcherType:"and"})})}function m(...e){return d({[r]:()=>({match:t=>{let n={};const r=(e,t)=>{n[e]=t};return u(e,c).forEach((e=>r(e,void 0))),{matched:e.some((e=>l(e,t,r))),selections:n}},getSelectionKeys:()=>u(e,c),matcherType:"or"})})}function g(e){return{[r]:()=>({match:t=>({matched:Boolean(e(t))})})}}function f(...e){const t="string"==typeof e[0]?e[0]:void 0,n=2===e.length?e[1]:"string"==typeof e[0]?void 0:e[0];return d({[r]:()=>({match:e=>{let r={[null!=t?t:i]:e};return{matched:void 0===n||l(n,e,((e,t)=>{r[e]=t})),selections:r}},getSelectionKeys:()=>[null!=t?t:i].concat(void 0===n?[]:c(n))})})}function y(e){return"number"==typeof e}function b(e){return"string"==typeof e}function v(e){return"bigint"==typeof e}d(g((function(e){return!0})));const w=e=>Object.assign(d(e),{startsWith:t=>{return w(p(e,(n=t,g((e=>b(e)&&e.startsWith(n))))));var n},endsWith:t=>{return w(p(e,(n=t,g((e=>b(e)&&e.endsWith(n))))));var n},minLength:t=>w(p(e,(e=>g((t=>b(t)&&t.length>=e)))(t))),maxLength:t=>w(p(e,(e=>g((t=>b(t)&&t.length<=e)))(t))),includes:t=>{return w(p(e,(n=t,g((e=>b(e)&&e.includes(n))))));var n},regex:t=>{return w(p(e,(n=t,g((e=>b(e)&&Boolean(e.match(n)))))));var n}}),x=(w(g(b)),e=>Object.assign(d(e),{between:(t,n)=>x(p(e,((e,t)=>g((n=>y(n)&&e<=n&&t>=n)))(t,n))),lt:t=>x(p(e,(e=>g((t=>y(t)&&t<e)))(t))),gt:t=>x(p(e,(e=>g((t=>y(t)&&t>e)))(t))),lte:t=>x(p(e,(e=>g((t=>y(t)&&t<=e)))(t))),gte:t=>x(p(e,(e=>g((t=>y(t)&&t>=e)))(t))),int:()=>x(p(e,g((e=>y(e)&&Number.isInteger(e))))),finite:()=>x(p(e,g((e=>y(e)&&Number.isFinite(e))))),positive:()=>x(p(e,g((e=>y(e)&&e>0)))),negative:()=>x(p(e,g((e=>y(e)&&e<0))))})),j=(x(g(y)),e=>Object.assign(d(e),{between:(t,n)=>j(p(e,((e,t)=>g((n=>v(n)&&e<=n&&t>=n)))(t,n))),lt:t=>j(p(e,(e=>g((t=>v(t)&&t<e)))(t))),gt:t=>j(p(e,(e=>g((t=>v(t)&&t>e)))(t))),lte:t=>j(p(e,(e=>g((t=>v(t)&&t<=e)))(t))),gte:t=>j(p(e,(e=>g((t=>v(t)&&t>=e)))(t))),positive:()=>j(p(e,g((e=>v(e)&&e>0)))),negative:()=>j(p(e,g((e=>v(e)&&e<0))))}));j(g(v)),d(g((function(e){return"boolean"==typeof e}))),d(g((function(e){return"symbol"==typeof e}))),d(g((function(e){return null==e})));const k={matched:!1,value:void 0};function C(e){return new E(e,k)}class E{constructor(e,t){this.input=void 0,this.state=void 0,this.input=e,this.state=t}with(...e){if(this.state.matched)return this;const t=e[e.length-1],n=[e[0]];let r;3===e.length&&"function"==typeof e[1]?r=e[1]:e.length>2&&n.push(...e.slice(1,e.length-1));let a=!1,s={};const o=(e,t)=>{a=!0,s[e]=t},c=!n.some((e=>l(e,this.input,o)))||r&&!Boolean(r(this.input))?k:{matched:!0,value:t(a?i in s?s[i]:s:this.input,this.input)};return new E(this.input,c)}when(e,t){if(this.state.matched)return this;const n=Boolean(e(this.input));return new E(this.input,n?{matched:!0,value:t(this.input,this.input)}:k)}otherwise(e){return this.state.matched?this.state.value:e(this.input)}exhaustive(){if(this.state.matched)return this.state.value;let e;try{e=JSON.stringify(this.input)}catch(a){e=this.input}throw new Error(`Pattern matching error: no pattern matches value ${e}`)}run(){return this.exhaustive()}returnType(){return this}}},7863:function(e){"use strict";e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#d8d8e8","images":{"fallback":{"src":"/static/b10e8f2b1ae0054584b80cce2ee4067e/e07e1/elon.jpg","srcSet":"/static/b10e8f2b1ae0054584b80cce2ee4067e/74ef0/elon.jpg 25w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/6ac16/elon.jpg 50w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/e07e1/elon.jpg 100w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/dd515/elon.jpg 200w","sizes":"(min-width: 100px) 100px, 100vw"},"sources":[{"srcSet":"/static/b10e8f2b1ae0054584b80cce2ee4067e/2fa99/elon.webp 25w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/dbc4a/elon.webp 50w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/d8057/elon.webp 100w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/2e34e/elon.webp 200w","type":"image/webp","sizes":"(min-width: 100px) 100px, 100vw"}]},"width":100,"height":100}')}}]);
//# sourceMappingURL=e71958dfb8ab3339a1eee4afe89e5bc11eaa6b20-b3f7408767eec75c4210.js.map