import smtplib, email, poplib
from flask import Flask, render_template, request, url_for, redirect, flash, session
from flask_mysqldb import MySQL
import pymysql.cursors
from email.message import EmailMessage
from email.mime.text import MIMEText
from datetime import datetime
from email.parser import BytesParser
from email import policy


app = Flask(__name__)
  
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'team02_06'
app.config['MYSQL_PORT'] = 3306
mysql = MySQL(app)

app.secret_key = "qwer"



@app.route('/')
def home():
    return render_template('login.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
 
    if request.method == 'POST':
        user_name = request.form['name']
        user_pw = request.form['pwd']

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE user_name = %s AND user_pw = %s", (user_name, user_pw))
        user = cur.fetchone()
        cur.close()

        if user:
            session['logged_in'] = True
            session['username'] = user_name
            return redirect(url_for('send'))
        else:
            flash('로그인 실패!!!', 'error')
            return redirect(url_for('login'))
        
 
    return render_template('login.html', error = error)

    

    
@app.route('/signGNK', methods=['GET','POST'])
def signGNK():
    error = None
    if request.method == 'POST':
        sign_user = request.form['user_id']
        sign_pwd = request.form['user_pw']
        sign_confirm = request.form['user_cp']

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (user_name, user_pw) VALUES (%s, %s)", (sign_user, sign_pwd))
        mysql.connection.commit()
        cur.execute("SELECT user_id FROM users WHERE user_name = %s AND user_pw = %s", (sign_user, sign_pwd))
        user_id=cur.fetchone()
        cur.close()

        session['user_id'] = user_id
        return render_template('signG.html')
    return render_template('signGNK.html', error=error)


@app.route('/signG', methods=['GET','POST'])
def signG():
    if request.method == 'POST':
        google_id = request.form['google_id']
        google_pw = request.form['google_pw']
        user_id = session['user_id']

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO usersEmail (user_id, google_name, google_pw) VALUES (%s, %s, %s)", (user_id, google_id, google_pw))
        mysql.connection.commit()
        cur.close()

        return render_template('signN.html')
    return render_template("signG.html")

@app.route('/signN', methods=['POST'])
def signN():
    if request.method == 'POST':
        naver_id = request.form.get('naver_id')
        naver_pw = request.form['naver_id']
        user_id = session['user_id']

        cur = mysql.connection.cursor()
        cur.execute("UPDATE usersEmail SET naver_name = %s, naver_pw = %s WHERE user_id = %s", (naver_id, naver_pw, user_id))

        mysql.connection.commit()
        cur.close()

        return render_template('signK.html')
    return render_template('signN.html')


@app.route('/signK', methods=['POST'])
def signK():
    if request.method == 'POST':
        kakao_id = request.form['kakao_id']
        kakao_pw = request.form['kakao_pw']
        user_id = session['user_id']

        cur = mysql.connection.cursor()
        cur.execute("update usersEmail set kakao_name = %s, kakao_pw = %s WHERE user_id = %s", (kakao_id, kakao_pw, user_id))
        mysql.connection.commit()
        cur.close()

        session.pop('user_id', None)
        return render_template('login.html')
    return render_template('signK.html')

def getSmtpServer(option):
    if option == 'google':
        return 'smtp.gmail.com'
    elif option == 'naver':
        return 'smtp.naver.com'
    elif option == 'kakao':
        return 'smtp.kakao.com'

@app.route('/write11', methods=['POST'])
def write11():
    if request.method == 'POST':
        user_name = session['username']

        subject = request.form['subject']
        message = request.form['message']
        recipient = request.form['recipient']
        option=request.form['option']

        #SMTP_SERVER = 'smtp.gmail.com'
        SMTP_SERVER = getSmtpServer(option)
        SMTP_PORT = 465                 # SSL

        # SMTP 서버 연결
        #smtp = smtplib.SMTP_SSL()
        #smtp.connect(SMTP_SERVER, SMTP_PORT)
        smtp = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        EMAIL_ADDR = 'asdf1472486@gmail.com'       # 연동 Email
        EMAIL_PASSWORD = 'xxmi rifl vtut qyez'      # 비번

        # SMTP 서버에 로그인
        smtp.login(EMAIL_ADDR, EMAIL_PASSWORD)

        # MIME 형태의 이메일 메세지 작성
        msg = EmailMessage()
        msg["Subject"] = subject                 # 메일 제목
        msg["From"] = EMAIL_ADDR                # 보내는 사람
        msg["To"] = recipient     # 받는 사람 db에 저장할지 생각 중
        msg.set_content(message)      # 전송 내용

        # 서버로 메일 보내기
        smtp.send_message(msg)

        # 메일을 보내면 서버와의 연결 끊기
        smtp.quit()
        
        cur = mysql.connection.cursor()
        '''
        addQ="INSERT INTO smtp (smtp_user, smtp_subject, smtp_recipient, smtp_message, email_id) VALUES (%s, %s, %s, %s, %s)"
        email_id=("select e.email_id from usersemail e join users u on u.user_name=%s", user_name)
        cur.execute(addQ, (EMAIL_ADDR, subject, recipient, message, email_id))
        mysql.connection.commit()
        #cur.execute("SELECT s.email_id FROM users u join usersEmail e on u.user_id=e.user_id join smtp s on e.email_id=s.email_id WHERE u.user_name = %s", (user_name))
        #cur.execute("update smtp set email_id = %s")
        cur.close()
'''

        return render_template('send.html')
    return render_template('write.html')

@app.route('/receive11', methods=['POST'])
def receive11():

    #smtp와 동일
    
    POP_SERVER = "pop.gmail.com"
    POP_PORT = 995

    # POP3 서버 연결
    pop = poplib.POP3_SSL(POP_SERVER, POP_PORT)

    EMAIL_ADDR = 'asdf1472486@gmail.com'        # Email 아이디
    EMAIL_PASSWORD = 'xxmi rifl vtut qyez'     # 비번

    pop.user(EMAIL_ADDR)
    pop.pass_(EMAIL_PASSWORD)
    pop.select()

    # 메일함에 있는 메일 수
    num_messages = len(pop.list()[1])

    # 모든 메일 읽어오기
    for i in range(num_messages):
        # 메일 번호와 메일 내용 가져오기
        response, msg_data, octets = pop.retr(i + 1)
        msg_content = b'\n'.join(msg_data).decode('utf-8')

        # 메일 파싱
        msg = BytesParser().parsebytes(msg_content.encode('utf-8'))

        # 메일 제목과 내용 출력
        raw_email = b"\n".join(pop.retr(i + 1)[1])
        msg = email.message_from_bytes(raw_email)

        while msg.is_multipart():
            msg = msg.get_payload(0)
    
        subject = msg.get('subject', 'No Subject')
        from_address = msg.get('from', 'No Sender')
        date = msg.get('date', 'No Date')
        message = msg.get_payload(decode=True)

    pop.close()
    return render_template('receive.html', subject=subject ,from_address=from_address, date=date, message=message)


@app.route('/signup')
def signup():
    return render_template("signGNK.html")

@app.route('/write')
def write():
    return render_template('write.html')

@app.route('/receive')
def receive():
    return render_template("receive.html")


@app.route('/writeme')
def writeme():
    return render_template('writeme.html')

@app.route('/writemegather')
def writemegather():
    return render_template('writemegather.html')

@app.route('/trash')
def trash():
    return render_template('trash.html')
    
@app.route('/send')
def send():
    return render_template('send.html')

if __name__ == "__main__": 
        
    app.run(debug=True, host='0.0.0.0', port=5000)
