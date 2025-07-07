export default function Card() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 text-center mb-4"></div>
        <div className="col-md-12 text-center mb-4">
      
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/Thapanan1.png"
              className="card-img-top img-responsive d-block w-100"
              alt="Project 1"
              width={480}
              height={480}
            />
            <div className="card-body">
              <p className="card-text">อาจารย์ฐาปนันท์ ปัญญามี</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/Anuchat2.png"
              className="card-img-top img-responsive d-block w-100"
              alt="Project 2"
              width={480}
              height={480}
            />
            <div className="card-body">
              <p className="card-text">อาจารย์อนุชาติ รังสิยานนท์</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/Tharit3.png"
              className="card-img-top img-responsive d-block w-100"
              alt="Project 3"
              width={480}
              height={480}
            />
            <div className="card-body">
              <p className="card-text">อาจารย์ธฤต ไชยมงคล</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <img
              src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/TIT04-724x1024.png"
              className="card-img-top img-responsive d-block w-100"
              alt="Project 4"
              width={480}
              height={480}
            />
            <div className="card-body">
              <p className="card-text">อาจารย์อมรินทร์ เลขะวณิชย์</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}