(self.webpackChunkhustle_dev_blog=self.webpackChunkhustle_dev_blog||[]).push([[194],{1365:function(e){"use strict";const t=/[\p{Lu}]/u,a=/[\p{Ll}]/u,r=/^[\p{Lu}](?![\p{Lu}])/gu,n=/([\p{Alpha}\p{N}_]|$)/u,s=/[_.\- ]+/,i=new RegExp("^"+s.source),o=new RegExp(s.source+n.source,"gu"),l=new RegExp("\\d+"+n.source,"gu"),c=(e,n)=>{if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");if(n={pascalCase:!1,preserveConsecutiveUppercase:!1,...n},0===(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim()).length)return"";const s=!1===n.locale?e=>e.toLowerCase():e=>e.toLocaleLowerCase(n.locale),c=!1===n.locale?e=>e.toUpperCase():e=>e.toLocaleUpperCase(n.locale);if(1===e.length)return n.pascalCase?c(e):s(e);return e!==s(e)&&(e=((e,r,n)=>{let s=!1,i=!1,o=!1;for(let l=0;l<e.length;l++){const c=e[l];s&&t.test(c)?(e=e.slice(0,l)+"-"+e.slice(l),s=!1,o=i,i=!0,l++):i&&o&&a.test(c)?(e=e.slice(0,l-1)+"-"+e.slice(l-1),o=i,i=!1,s=!0):(s=r(c)===c&&n(c)!==c,o=i,i=n(c)===c&&r(c)!==c)}return e})(e,s,c)),e=e.replace(i,""),e=n.preserveConsecutiveUppercase?((e,t)=>(r.lastIndex=0,e.replace(r,(e=>t(e)))))(e,s):s(e),n.pascalCase&&(e=c(e.charAt(0))+e.slice(1)),((e,t)=>(o.lastIndex=0,l.lastIndex=0,e.replace(o,((e,a)=>t(a))).replace(l,(e=>t(e)))))(e,c)};e.exports=c,e.exports.default=c},3388:function(e,t,a){var r=a(7049);function n(e){return r.createElement("svg",e,[r.createElement("g",{clipPath:"url(#clip0_30_1176)",key:0},r.createElement("path",{d:"M26.9999 24.363L15.8624 35.5005L12.6809 32.319L26.9999 18L41.3189 32.319L38.1374 35.5005L26.9999 24.363Z",fill:"white"})),r.createElement("defs",{key:1},r.createElement("clipPath",{id:"clip0_30_1176"},r.createElement("rect",{width:"54",height:"54",fill:"white"})))])}n.defaultProps={width:"54",height:"54",viewBox:"0 0 54 54",fill:"none",className:"my-class"},e.exports=n,n.default=n},7561:function(e,t,a){var r=a(7049);function n(e){return r.createElement("svg",e,r.createElement("path",{d:"M13.375 1H10C8.50816 1 7.07742 1.59263 6.02252 2.64752C4.96763 3.70242 4.375 5.13316 4.375 6.625V10H1V14.5H4.375V23.5H8.875V14.5H12.25L13.375 10H8.875V6.625C8.875 6.32663 8.99353 6.04048 9.2045 5.82951C9.41548 5.61853 9.70163 5.5 10 5.5H13.375V1Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"}))}n.defaultProps={width:"15",height:"25",viewBox:"0 0 15 25",fill:"none",className:"my-class"},e.exports=n,n.default=n},7194:function(e,t,a){var r=a(7049);function n(e){return r.createElement("svg",e,r.createElement("path",{d:"M7.10256 17.2892C2.74359 18.6446 2.74359 15.0302 1 14.5783M13.2051 20V16.503C13.2378 16.0722 13.1817 15.639 13.0404 15.2324C12.8991 14.8257 12.6759 14.4549 12.3856 14.1446C15.1231 13.8284 18 12.7531 18 7.81935C17.9998 6.55776 17.5316 5.34454 16.6923 4.43082C17.0897 3.32706 17.0616 2.10705 16.6138 1.02421C16.6138 1.02421 15.5851 0.707947 13.2051 2.36155C11.207 1.80025 9.10071 1.80025 7.10256 2.36155C4.72256 0.707947 3.69385 1.02421 3.69385 1.02421C3.24607 2.10705 3.21797 3.32706 3.61538 4.43082C2.76985 5.35132 2.30117 6.5755 2.30769 7.84646C2.30769 12.744 5.18462 13.8193 7.92205 14.1717C7.63523 14.4789 7.41402 14.8453 7.27283 15.2469C7.13164 15.6486 7.07363 16.0766 7.10256 16.503V20",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"}))}n.defaultProps={width:"19",height:"21",viewBox:"0 0 19 21",fill:"none",className:"my-class"},e.exports=n,n.default=n},3188:function(e,t,a){var r=a(7049);function n(e){return r.createElement("svg",e,[r.createElement("path",{d:"M16.6667 8.33301C18.3244 8.33301 19.9141 8.99149 21.0862 10.1636C22.2583 11.3357 22.9167 12.9254 22.9167 14.583V21.8747H18.7501V14.583C18.7501 14.0305 18.5306 13.5006 18.1399 13.1099C17.7492 12.7192 17.2193 12.4997 16.6667 12.4997C16.1142 12.4997 15.5843 12.7192 15.1936 13.1099C14.8029 13.5006 14.5834 14.0305 14.5834 14.583V21.8747H10.4167V14.583C10.4167 12.9254 11.0752 11.3357 12.2473 10.1636C13.4194 8.99149 15.0091 8.33301 16.6667 8.33301Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:0}),r.createElement("path",{d:"M6.24992 9.375H2.08325V21.875H6.24992V9.375Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:1}),r.createElement("path",{d:"M4.16659 6.24967C5.31718 6.24967 6.24992 5.31693 6.24992 4.16634C6.24992 3.01575 5.31718 2.08301 4.16659 2.08301C3.01599 2.08301 2.08325 3.01575 2.08325 4.16634C2.08325 5.31693 3.01599 6.24967 4.16659 6.24967Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:2})])}n.defaultProps={width:"25",height:"25",viewBox:"0 0 25 25",fill:"none",className:"my-class"},e.exports=n,n.default=n},8120:function(e,t,a){var r=a(7049);function n(e){return r.createElement("svg",e,[r.createElement("path",{d:"M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:0}),r.createElement("path",{d:"M22 6L12 13L2 6",stroke:"#15AF73",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round",key:1})])}n.defaultProps={width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",className:"my-class"},e.exports=n,n.default=n},223:function(e,t,a){"use strict";a.d(t,{G:function(){return V},L:function(){return f},M:function(){return j},P:function(){return C},S:function(){return D},_:function(){return o},a:function(){return i},b:function(){return p},d:function(){return d},g:function(){return m},h:function(){return l}});var r=a(7049),n=(a(1365),a(337)),s=a.n(n);function i(){return i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},i.apply(this,arguments)}function o(e,t){if(null==e)return{};var a,r,n={},s=Object.keys(e);for(r=0;r<s.length;r++)t.indexOf(a=s[r])>=0||(n[a]=e[a]);return n}const l=()=>"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;const c=e=>{var t;return(e=>{var t,a;return Boolean(null==e||null==(t=e.images)||null==(a=t.fallback)?void 0:a.src)})(e)?e:(e=>Boolean(null==e?void 0:e.gatsbyImageData))(e)?e.gatsbyImageData:(e=>Boolean(null==e?void 0:e.gatsbyImage))(e)?e.gatsbyImage:null==e||null==(t=e.childImageSharp)?void 0:t.gatsbyImageData},d=e=>{var t,a,r;return null==(t=c(e))||null==(a=t.images)||null==(r=a.fallback)?void 0:r.src};function u(e,t,a){const r={};let n="gatsby-image-wrapper";return"fixed"===a?(r.width=e,r.height=t):"constrained"===a&&(n="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:n,"data-gatsby-image-wrapper":"",style:r}}function p(e,t,a,r,n){return void 0===n&&(n={}),i({},a,{loading:r,shouldLoad:e,"data-main-image":"",style:i({},n,{opacity:t?1:0})})}function m(e,t,a,r,n,s,o,l){const c={};s&&(c.backgroundColor=s,"fixed"===a?(c.width=r,c.height=n,c.backgroundColor=s,c.position="relative"):("constrained"===a||"fullWidth"===a)&&(c.position="absolute",c.top=0,c.left=0,c.bottom=0,c.right=0)),o&&(c.objectFit=o),l&&(c.objectPosition=l);const d=i({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:i({opacity:t?0:1,transition:"opacity 500ms linear"},c)});return d}const g=["children"],h=function(e){let{layout:t,width:a,height:n}=e;return"fullWidth"===t?r.createElement("div",{"aria-hidden":!0,style:{paddingTop:n/a*100+"%"}}):"constrained"===t?r.createElement("div",{style:{maxWidth:a,display:"block"}},r.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:`data:image/svg+xml;charset=utf-8,%3Csvg%20height='${n}'%20width='${a}'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E`,style:{maxWidth:"100%",display:"block",position:"static"}})):null},f=function(e){let{children:t}=e,a=o(e,g);return r.createElement(r.Fragment,null,r.createElement(h,i({},a)),t,null)},b=["src","srcSet","loading","alt","shouldLoad"],y=["fallback","sources","shouldLoad"],w=function(e){let{src:t,srcSet:a,loading:n,alt:s="",shouldLoad:l}=e,c=o(e,b);return r.createElement("img",i({},c,{decoding:"async",loading:n,src:l?t:void 0,"data-src":l?void 0:t,srcSet:l?a:void 0,"data-srcset":l?void 0:a,alt:s}))},v=function(e){let{fallback:t,sources:a=[],shouldLoad:n=!0}=e,s=o(e,y);const l=s.sizes||(null==t?void 0:t.sizes),c=r.createElement(w,i({},s,t,{sizes:l,shouldLoad:n}));return a.length?r.createElement("picture",null,a.map((e=>{let{media:t,srcSet:a,type:s}=e;return r.createElement("source",{key:`${t}-${s}-${a}`,type:s,media:t,srcSet:n?a:void 0,"data-srcset":n?void 0:a,sizes:l})})),c):c};var x;w.propTypes={src:n.string.isRequired,alt:n.string.isRequired,sizes:n.string,srcSet:n.string,shouldLoad:n.bool},v.displayName="Picture",v.propTypes={alt:n.string.isRequired,shouldLoad:n.bool,fallback:n.exact({src:n.string.isRequired,srcSet:n.string,sizes:n.string}),sources:n.arrayOf(n.oneOfType([n.exact({media:n.string.isRequired,type:n.string,sizes:n.string,srcSet:n.string.isRequired}),n.exact({media:n.string,type:n.string.isRequired,sizes:n.string,srcSet:n.string.isRequired})]))};const k=["fallback"],C=function(e){let{fallback:t}=e,a=o(e,k);return t?r.createElement(v,i({},a,{fallback:{src:t},"aria-hidden":!0,alt:""})):r.createElement("div",i({},a))};C.displayName="Placeholder",C.propTypes={fallback:n.string,sources:null==(x=v.propTypes)?void 0:x.sources,alt:function(e,t,a){return e[t]?new Error(`Invalid prop \`${t}\` supplied to \`${a}\`. Validation failed.`):null}};const j=function(e){return r.createElement(r.Fragment,null,r.createElement(v,i({},e)),r.createElement("noscript",null,r.createElement(v,i({},e,{shouldLoad:!0}))))};j.displayName="MainImage",j.propTypes=v.propTypes;const E=["as","className","class","style","image","loading","imgClassName","imgStyle","backgroundColor","objectFit","objectPosition"],L=["style","className"],N=e=>e.replace(/\n/g,""),S=function(e,t,a){for(var r=arguments.length,n=new Array(r>3?r-3:0),i=3;i<r;i++)n[i-3]=arguments[i];return e.alt||""===e.alt?s().string.apply(s(),[e,t,a].concat(n)):new Error(`The "alt" prop is required in ${a}. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html`)},I={image:s().object.isRequired,alt:S},_=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],A=["style","className"],T=new Set;let P,$;const H=function(e){let{as:t="div",image:n,style:s,backgroundColor:c,className:d,class:p,onStartLoad:m,onLoad:g,onError:h}=e,f=o(e,_);const{width:b,height:y,layout:w}=n,v=u(b,y,w),{style:x,className:k}=v,C=o(v,A),j=(0,r.useRef)(),E=(0,r.useMemo)((()=>JSON.stringify(n.images)),[n.images]);p&&(d=p);const L=function(e,t,a){let r="";return"fullWidth"===e&&(r=`<div aria-hidden="true" style="padding-top: ${a/t*100}%;"></div>`),"constrained"===e&&(r=`<div style="max-width: ${t}px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg%20height='${a}'%20width='${t}'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E" style="max-width: 100%; display: block; position: static;"></div>`),r}(w,b,y);return(0,r.useEffect)((()=>{P||(P=a.e(998).then(a.bind(a,998)).then((e=>{let{renderImageToString:t,swapPlaceholderImage:a}=e;return $=t,{renderImageToString:t,swapPlaceholderImage:a}})));const e=j.current.querySelector("[data-gatsby-image-ssr]");if(e&&l())return e.complete?(null==m||m({wasCached:!0}),null==g||g({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)):(null==m||m({wasCached:!0}),e.addEventListener("load",(function t(){e.removeEventListener("load",t),null==g||g({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)}))),void T.add(E);if($&&T.has(E))return;let t,r;return P.then((e=>{let{renderImageToString:a,swapPlaceholderImage:o}=e;j.current&&(j.current.innerHTML=a(i({isLoading:!0,isLoaded:T.has(E),image:n},f)),T.has(E)||(t=requestAnimationFrame((()=>{j.current&&(r=o(j.current,E,T,s,m,g,h))}))))})),()=>{t&&cancelAnimationFrame(t),r&&r()}}),[n]),(0,r.useLayoutEffect)((()=>{T.has(E)&&$&&(j.current.innerHTML=$(i({isLoading:T.has(E),isLoaded:T.has(E),image:n},f)),null==m||m({wasCached:!0}),null==g||g({wasCached:!0}))}),[n]),(0,r.createElement)(t,i({},C,{style:i({},x,s,{backgroundColor:c}),className:`${k}${d?` ${d}`:""}`,ref:j,dangerouslySetInnerHTML:{__html:L},suppressHydrationWarning:!0}))},V=(0,r.memo)((function(e){return e.image?(0,r.createElement)(H,e):null}));V.propTypes=I,V.displayName="GatsbyImage";const F=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"];function M(e){return function(t){let{src:a,__imageData:n,__error:s}=t,l=o(t,F);return s&&console.warn(s),n?r.createElement(e,i({image:n},l)):(console.warn("Image not loaded",a),null)}}const O=M((function(e){let{as:t="div",className:a,class:n,style:s,image:l,loading:c="lazy",imgClassName:d,imgStyle:g,backgroundColor:h,objectFit:b,objectPosition:y}=e,w=o(e,E);if(!l)return console.warn("[gatsby-plugin-image] Missing image prop"),null;n&&(a=n),g=i({objectFit:b,objectPosition:y,backgroundColor:h},g);const{width:v,height:x,layout:k,images:S,placeholder:I,backgroundColor:_}=l,A=u(v,x,k),{style:T,className:P}=A,$=o(A,L),H={fallback:void 0,sources:[]};return S.fallback&&(H.fallback=i({},S.fallback,{srcSet:S.fallback.srcSet?N(S.fallback.srcSet):void 0})),S.sources&&(H.sources=S.sources.map((e=>i({},e,{srcSet:N(e.srcSet)})))),r.createElement(t,i({},$,{style:i({},T,s,{backgroundColor:h}),className:`${P}${a?` ${a}`:""}`}),r.createElement(f,{layout:k,width:v,height:x},r.createElement(C,i({},m(I,!1,k,v,x,_,b,y))),r.createElement(j,i({"data-gatsby-image-ssr":"",className:d},w,p("eager"===c,!1,H,c,g)))))})),W=function(e,t){for(var a=arguments.length,r=new Array(a>2?a-2:0),n=2;n<a;n++)r[n-2]=arguments[n];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?s().number.apply(s(),[e,t].concat(r)):new Error(`"${t}" ${e[t]} may not be passed when layout is fullWidth.`)},R=new Set(["fixed","fullWidth","constrained"]),q={src:s().string.isRequired,alt:S,width:W,height:W,sizes:s().string,layout:e=>{if(void 0!==e.layout&&!R.has(e.layout))return new Error(`Invalid value ${e.layout}" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".`)}};O.displayName="StaticImage",O.propTypes=q;const D=M(V);D.displayName="StaticImage",D.propTypes=q},4485:function(e,t,a){"use strict";a.d(t,{Tv:function(){return l},dq:function(){return d},PP:function(){return E},pQ:function(){return N},Vp:function(){return S}});var r=a(1664),n=a(3388),s=a.n(n),i=a(7049);var o=a(5366);const l=()=>{const{isVisible:e,scrollToTop:t}=(()=>{const{0:e,1:t}=(0,i.useState)(!1),a=()=>{const e=window.scrollY;t(e>200)};return(0,i.useEffect)((()=>(window.addEventListener("scroll",a),()=>{window.removeEventListener("scroll",a)})),[]),{isVisible:e,scrollToTop:()=>{window.scrollTo({top:0,behavior:"smooth"})}}})();return(0,o.jsx)("button",{className:(0,r.Z)("FloatingButton-module--floatingButton--8fc0b",{"FloatingButton-module--visible--e951f":e}),onClick:t,children:(0,o.jsx)(s(),{})})};var c=a(5026);const d=()=>{const e=(0,i.useRef)(null),{theme:t}=(0,c.Fg)();return(0,i.useEffect)((()=>{if(null===e.current)return;const a=e.current,r=document.createElement("script");return r.src="https://giscus.app/client.js",r.setAttribute("data-repo","hustle-dev/hustle-dev.github.io"),r.setAttribute("data-repo-id","R_kgDOJUJ_0Q"),r.setAttribute("data-category","Comments"),r.setAttribute("data-category-id","DIC_kwDOJUJ_0c4CVoHk"),r.setAttribute("data-mapping","og:title"),r.setAttribute("data-strict","0"),r.setAttribute("data-reactions-enabled","1"),r.setAttribute("data-emit-metadata","0"),r.setAttribute("data-input-position","bottom"),r.setAttribute("data-theme",t===c.Q2.LIGHT?"light":"https://cdn.jsdelivr.net/gh/hustle-dev/hustle-dev.github.io@main/src/components/Giscus/custom-giscus-theme.css"),r.setAttribute("data-lang","ko"),r.setAttribute("crossorigin","anonymous"),r.async=!0,a.appendChild(r),()=>{null!==a&&a.removeChild(r)}}),[t]),(0,o.jsx)("div",{id:"comment",ref:e})};var u=a(223),p=a(1692);const m=e=>{let{className:t}=e;return(0,o.jsx)("p",{className:(0,r.Z)("Description-module--description--0320c",t),children:"It is possible for ordinary people to choose to be extraordinary."})};const g=e=>{let{text:t}=e;return(0,o.jsx)("h1",{className:"Heading-module--name--fe536",children:t})};var h=a(7561),f=a.n(h),b=a(7194),y=a.n(b),w=a(3188),v=a.n(w),x=a(8120),k=a.n(x);const C=e=>{let{href:t,children:a}=e;return(0,o.jsx)("a",{href:t,target:"_blank",className:"IconWrapper-module--profileIcon--6cfc9",rel:"noreferrer",children:a})},j=()=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(C,{href:"mailto:dlwoabsdk@gmail.com",children:(0,o.jsx)(k(),{})}),(0,o.jsx)(C,{href:"https://www.facebook.com/jeongminiminimini/",children:(0,o.jsx)(f(),{})}),(0,o.jsx)(C,{href:"https://www.linkedin.com/in/jeongmin-lee-5ab898202/",children:(0,o.jsx)(v(),{})}),(0,o.jsx)(C,{href:"https://github.com/hustle-dev",children:(0,o.jsx)(y(),{})})]});const E=e=>{let{pathname:t}=e;const r=t.includes("/posts/");return(0,p.EQ)(r).with(!0,(()=>(0,o.jsxs)("div",{className:"ProfileCard-module--wrapper--edfc1",children:[(0,o.jsx)(u.S,{src:"../../images/elon.jpeg",alt:"일론 머스크",objectFit:"fill",className:"ProfileCard-module--postProfileImage--4a121",width:100,height:100,__imageData:a(1127)}),(0,o.jsxs)("div",{children:[(0,o.jsx)(g,{text:"Hustle-dev"}),(0,o.jsx)(m,{className:"ProfileCard-module--postDescription--7d431"}),(0,o.jsx)("div",{className:"ProfileCard-module--iconWrapper--d0fd6",children:(0,o.jsx)(j,{})})]})]}))).with(!1,(()=>(0,o.jsxs)("div",{className:"ProfileCard-module--card--3d81d",children:[(0,o.jsx)(g,{text:"Hustle-devlog"}),(0,o.jsx)(m,{}),(0,o.jsxs)("div",{className:"ProfileCard-module--info--32e1d",children:[(0,o.jsx)(u.S,{src:"../../images/elon.jpeg",alt:"일론 머스크",className:"ProfileCard-module--profileImage--4692c",width:100,height:100,__imageData:a(1127)}),(0,o.jsx)(j,{})]})]}))).exhaustive()};var L=a(2955);const N=e=>{let{title:t,description:a,heroImage:r,pathname:n,children:s}=e;const i=(0,L.useStaticQuery)("1485575810"),{title:l,description:c,siteUrl:d}=i.site.siteMetadata,{publicURL:u}=i.file,p={title:t||l,description:a||c,url:`${d}${n||""}`,image:`${d}${r||u}`};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("title",{children:p.title}),(0,o.jsx)("link",{rel:"canonical",href:p.url}),(0,o.jsx)("meta",{name:"description",content:p.description}),(0,o.jsx)("meta",{name:"image",content:p.image}),(0,o.jsx)("meta",{property:"og:title",content:p.title}),(0,o.jsx)("meta",{property:"og:description",content:p.description}),(0,o.jsx)("meta",{property:"og:type",content:"blog"}),(0,o.jsx)("meta",{property:"og:url",content:p.url}),(0,o.jsx)("meta",{property:"og:image",content:p.image}),(0,o.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,o.jsx)("meta",{name:"twitter:title",content:p.title}),(0,o.jsx)("meta",{name:"twitter:description",content:p.description}),(0,o.jsx)("meta",{property:"twitter:image",content:p.image}),s]})};const S=e=>{let{name:t,className:a}=e;return(0,o.jsx)("div",{className:(0,r.Z)("Tag-module--tag--55cfc",a),children:(0,o.jsx)("span",{children:t})})}},1127:function(e){"use strict";e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#d8d8e8","images":{"fallback":{"src":"/static/b10e8f2b1ae0054584b80cce2ee4067e/e07e1/elon.jpg","srcSet":"/static/b10e8f2b1ae0054584b80cce2ee4067e/74ef0/elon.jpg 25w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/6ac16/elon.jpg 50w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/e07e1/elon.jpg 100w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/dd515/elon.jpg 200w","sizes":"(min-width: 100px) 100px, 100vw"},"sources":[{"srcSet":"/static/b10e8f2b1ae0054584b80cce2ee4067e/2fa99/elon.webp 25w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/dbc4a/elon.webp 50w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/d8057/elon.webp 100w,\\n/static/b10e8f2b1ae0054584b80cce2ee4067e/2e34e/elon.webp 200w","type":"image/webp","sizes":"(min-width: 100px) 100px, 100vw"}]},"width":100,"height":100}')}}]);
//# sourceMappingURL=e71958dfb8ab3339a1eee4afe89e5bc11eaa6b20-176e5da217ef515a7e17.js.map