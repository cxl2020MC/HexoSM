from flask import Blueprint, request, jsonify, session, redirect, render_template

bp = Blueprint('page', __name__)


@bp.route('/')
def index():
    if not session.get("login"):
        return redirect("/login/")
    return render_template("Dashboard.html")

@bp.route('/login/')
def login():
    if session.get("login"):
        return redirect("/")
    return render_template("login.html")