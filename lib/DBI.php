<?php

class DBI {

	public $db;
	public $error;
	public $error_msg; 
	public $lastID;

	function __construct($host,$name,$user,$pass) {
		$this->host = $host;
		$this->name = $name;
		$this->user = $user;
		$this->pass = $pass;

		if ($this->db = @mysqli_connect($this->host, $this->user, $this->pass, $this->name)) {
			mysqli_set_charset($this->db, 'utf8');
			mysqli_query($this->db, 'SET NAMES "utf8"');
			mysqli_query($this->db, 'SET CHARACTER SET "utf8"');
			mysqli_query($this->db, 'SET character_set_results = "utf8",' . 'character_set_client = "utf8", character_set_connection = "utf8",' . 'character_set_database = "utf8", character_set_server = "utf8"');
		} else { 
			$this->error = true;
			$this->error_msg = 'Unable to connect to DB';
		} 
		date_default_timezone_set('America/Toronto');
	}

	function error_test() {
		if ($this->error_msg = mysqli_error($this->db)) {
			$this->error = true; 
		} else { 
			$this->error = false;
		}
		return $this->error;
	}

	function clean($str) { 
		if (get_magic_quotes_gpc()) $str = stripslashes($str);
		return mysqli_real_escape_string($this->db,$str);
	}

	function query($query) {
		$result = mysqli_query($this->db, $query);
		$this->error_test();
		return $result;
	}

	function insert($table,$arr,$ignoreClean=null) {
		if (is_null($ignoreClean)) $ignoreClean = array();
		$fields = '';
		$query = "INSERT INTO ".$this->clean($table)." SET ";
		foreach($arr as $key => $value) {
			if (in_array($key, $ignoreClean)) {
				$fields .= "`".$this->clean($key)."`=".$value.", ";
			} else {
				$fields .= "`".$this->clean($key)."`='".$this->clean($value)."', ";
			}
		}
		$query .= rtrim($fields, ', ');
		mysqli_query($this->db, $query);
		$this->lastID = mysqli_insert_id($this->db);
		return !$this->error_test();
	}
	function delete($table, $whereArr) {
		$where = "";		
		foreach ($whereArr as $key => $value) {
			$where .=  $this->clean($key)."='".$this->clean($value)."' AND ";
		}
		$where = rtrim($where,' AND ');
		$query = "DELETE FROM ".$this->clean($table)." WHERE $where";
		$result = mysqli_query($this->db, $query);

		return !$this->error_test();
	}

	function update($table, $dataArr, $whereArr) {
		$update = "";
		$where = "";
		foreach ($dataArr as $key => $value) {
				$update .= $this->clean($key)."='".$this->clean($value)."', ";
		}
		$update = rtrim($update,', ');
		foreach ($whereArr as $key => $value) {
				$where .=  $this->clean($key)."='".$this->clean($value)."' AND ";
		}
		$where = rtrim($where,' AND ');
		$query = "UPDATE ".$this->clean($table)." SET $update WHERE $where";
		$result = mysqli_query($this->db, $query);
		return !$this->error_test();
	}

	function get($field,$table,$whereArray) {
		$where = "";
		if (is_array($whereArray)) {
			$where = " WHERE ";
			foreach ($whereArray as $key => $value) {
					$where .=  $this->clean($key)."='".$this->clean($value)."' AND ";
			}
			$where = rtrim($where,' AND ');
		}
		
		$query = "SELECT ".$this->clean($field)." FROM ".$this->clean($table).$where." LIMIT 1";
		$result = mysqli_fetch_row($this->query($query));
		return $result[0];
	}

	function count($table,$whereArray) {
		$where = "";
		if (is_array($whereArray)) {
			$where = " WHERE ";
			foreach ($whereArray as $key => $value) {
					$where .=  $this->clean($key)."='".$this->clean($value)."' AND ";
			}
			$where = rtrim($where,' AND ');
		}
		$query = "SELECT COUNT(*) FROM ".$this->clean($table).$where;
		$result = mysqli_fetch_row($this->query($query));
		return $result[0];
	}

	function timestamp() {
		return date("Y-m-d H:i:s");
	}

	function date() {
		return date("Y-m-d");
	}

	function getIP() {
		if (!empty($_SERVER['HTTP_TRUE_CLIENT_IP'])) return $_SERVER['HTTP_TRUE_CLIENT_IP'];
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
		if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return $_SERVER['HTTP_X_FORWARDED_FOR'];
		return $_SERVER['REMOTE_ADDR'];
	}
}

?>