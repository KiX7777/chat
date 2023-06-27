/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classes from './ChatForm.module.css';
import { useRef, useState } from 'react';
import { ref, child, set, serverTimestamp } from 'firebase/database';
import { database, sendImg } from '../firebaseFunctions';
import { Message } from './Chat';
import { useAppSelector, useAppDispatch } from '../hooks';
import { sendIndMessage } from '../Stores/UserSlice';
import { useTranslation } from 'react-i18next';

const ChatForm = ({
  room,
  combinedID,
  receiverID,
}: {
  room?: string;
  combinedID?: string;
  receiverID?: string;
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const time = serverTimestamp();
  const dispatch = useAppDispatch();
  const currentuser = useAppSelector((state) => state.user);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const uploadSelector = useRef<HTMLInputElement>(null);

  async function upload(): Promise<string> {
    const res = await sendImg(currentuser, image);
    return res!;
  }
  // function download(): void {
  //   fetch(
  //     'https://firebasestorage.googleapis.com/v0/b/chatapp-22851.appspot.com/o/chatMessages%2Fimages%2Fhr.webp?alt=media&token=5c4c51de-ebd9-4334-8b29-48ac8b2e3d04'
  //   )
  //     .then((res) => res.blob())
  //     .then((blob) => {
  //       const url = URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = 'hrvatska.jpg';
  //       link.click();
  //     });
  // }

  const handleSubmit = async () => {
    const inputMsg = inputRef.current?.value as string;

    if (room) {
      const date = Date.now();
      //enter the correct room database
      const roomRef = ref(database, `rooms/${room}`);
      //create new message with current time as key
      const nodeRef = child(roomRef, `${date}`);
      let message;

      if (inputMsg || image) {
        if (image) {
          const img = await sendImg(currentuser, image);
          message = {
            sender: currentuser.username,
            time: time,
            message: inputMsg || '',
            image: img,
          };
        } else {
          message = {
            sender: currentuser.username,
            time: time,
            message: inputMsg,
          };
        }

        //send message to the server
        await set(nodeRef, message);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inputRef.current!.value = '';
        uploadSelector.current!.value = '';
        setImage(undefined);
        setPreview('');
      }
    } else {
      //if it is individual chat
      if (inputMsg || image) {
        if (image) {
          const img = (await sendImg(currentuser, image)) as string;
          const msg = {
            text: inputMsg || '',
            img,
          };
          dispatch(
            sendIndMessage({
              currentuser,
              receiverID,
              combinedID,
              msg,
            })
          );
        } else {
          const msg = inputMsg;
          dispatch(
            sendIndMessage({
              currentuser,
              receiverID,
              combinedID,
              msg,
            })
          );
        }

        inputRef.current!.value = '';
        uploadSelector.current!.value = '';
        setImage(undefined);
        setPreview('');
        return;
      }
    }
  };

  return (
    <div className={classes.newMessageContainer}>
      {!preview && (
        <button
          className={classes.addImg}
          onClick={() => {
            uploadSelector.current?.click();
          }}
        >
          <svg
            fill='#000000'
            version='1.1'
            id='Capa_1'
            width='800px'
            height='800px'
            viewBox='0 0 380 380'
            xmlSpace='preserve'
          >
            <g>
              <g>
                <g>
                  <path
                    d='M370,35.025H10c-5.522,0-10,4.477-10,10v289.949c0,5.522,4.478,10,10,10h360c5.522,0,10-4.478,10-10V45.025
				C380,39.502,375.522,35.025,370,35.025z M342.285,307.26H37.715V72.74h304.57V307.26z'
                  />
                  <path
                    d='M75.555,283.303h228.891c5.121,0,9.271-4.151,9.271-9.272v-53.155c0-2.42-0.943-4.743-2.637-6.476l-25.474-26.114
				c-3.475-3.559-9.133-3.745-12.83-0.425l-48.028,43.106l-82.928-75.259c-3.35-3.038-8.398-3.219-11.955-0.428
				c-11.679,9.165-37.859,29.708-60.033,47.094c-2.241,1.758-3.551,4.448-3.551,7.297v64.358
				C66.282,279.15,70.434,283.303,75.555,283.303z'
                  />
                  <path
                    d='M227.602,197.822c11.483,0,20.826-9.343,20.826-20.825c0-11.483-9.343-20.825-20.826-20.825
				c-11.48,0-20.823,9.342-20.823,20.825C206.777,188.479,216.119,197.822,227.602,197.822z'
                  />
                </g>
              </g>
            </g>
          </svg>
        </button>
      )}
      <input
        type='file'
        ref={uploadSelector}
        onChange={(e) => {
          if (!e.target.files) {
            return;
          }
          setImage(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
          // setPreview(e.target.files[0]);
        }}
      />
      {preview && (
        <img
          onClick={() => {
            uploadSelector.current?.click();
          }}
          className={classes.previewImg}
          src={preview}
          alt='img'
        />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label htmlFor='message' hidden></label>
        <input
          ref={inputRef}
          type='text'
          id='message'
          placeholder={t('writeMsg')}
        />
        <button className={classes.sendBtn}>
          <svg
            fill='#000000'
            height='800px'
            width='800px'
            version='1.1'
            id='Layer_1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512.001 512.001'
            xmlSpace='preserve'
          >
            <g>
              <g>
                <path
                  d='M509.532,34.999c-2.292-2.233-5.678-2.924-8.658-1.764L5.213,225.734c-2.946,1.144-4.967,3.883-5.192,7.034
			c-0.225,3.151,1.386,6.149,4.138,7.7l102.719,57.875l35.651,174.259c0.222,1.232,0.723,2.379,1.442,3.364
			c0.072,0.099,0.131,0.175,0.191,0.251c1.256,1.571,3.037,2.668,5.113,3c0.265,0.042,0.531,0.072,0.795,0.088
			c0.171,0.011,0.341,0.016,0.511,0.016c1.559,0,3.036-0.445,4.295-1.228c0.426-0.264,0.831-0.569,1.207-0.915
			c0.117-0.108,0.219-0.205,0.318-0.306l77.323-77.52c3.186-3.195,3.18-8.369-0.015-11.555c-3.198-3.188-8.368-3.18-11.555,0.015
			l-60.739,60.894l13.124-112.394l185.495,101.814c1.868,1.02,3.944,1.239,5.846,0.78c0.209-0.051,0.4-0.105,0.589-0.166
			c1.878-0.609,3.526-1.877,4.574-3.697c0.053-0.094,0.1-0.179,0.146-0.264c0.212-0.404,0.382-0.8,0.517-1.202L511.521,43.608
			C512.6,40.596,511.824,37.23,509.532,34.999z M27.232,234.712L432.364,77.371l-318.521,206.14L27.232,234.712z M162.72,316.936
			c-0.764,0.613-1.429,1.374-1.949,2.267c-0.068,0.117-0.132,0.235-0.194,0.354c-0.496,0.959-0.784,1.972-0.879,2.986L148.365,419.6
			l-25.107-122.718l275.105-178.042L162.72,316.936z M359.507,419.195l-177.284-97.307L485.928,66.574L359.507,419.195z'
                />
              </g>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
