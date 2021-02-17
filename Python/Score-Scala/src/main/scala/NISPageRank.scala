import scala.io.Source
import org.apache.spark.graphx.GraphLoader
import org.apache.spark.sql.SparkSession

object NISPageRank {
  private var followers: String = _
  private var people: String = _
  private var output: String = _
  private var resetProb: Double = 0.15
  private var tol: Double = 0.01

  def main(args: Array[String]): Unit = {
    parseCommandLineArgs(args)

    try {
      // Creates a SparkSession.
      val spark = SparkSession
        .builder
        .appName(s"${this.getClass.getSimpleName}")
        .getOrCreate()
      val sc = spark.sparkContext

      // Get the aws credentials
      val (accessId: String, secretKey: String) = getCredentials

      // Apply the aws credentials with hadoopConfiguration
      sc.hadoopConfiguration.set("fs.s3n.awsAccessKeyId", accessId)
      sc.hadoopConfiguration.set("fs.s3n.awsSecretAccessKey", secretKey)

      // Load the edges as a graph
      val graph = GraphLoader.edgeListFile(sc, followers)
      // Run PageRank
      val ranks = graph.pageRank(tol, resetProb).vertices.cache()
      // num of users
      val numUsers = ranks.count
      // Join the ranks with the user ids
      val users = sc.textFile(people).map { line =>
        val fields = line.split(",")
        (fields(0).toLong, fields(1))
      }
      val ranksByUserId = users.join(ranks).map {
        case (id, (userId, rank)) => (userId + "," + (rank / numUsers))
      }

      ranksByUserId.saveAsTextFile(output)
      // Stop the spark session
      spark.stop()
    } catch {
      case e: Exception => {
        e.printStackTrace()
        System.exit(1)
      }
    }
  }

  def getCredentials: Any = {
    try {
      // Read the aws credentials file
      val credentials = Source.fromFile(sys.env("HOME") + "/.aws/credentials").getLines()
      val array = credentials.toArray
      // Extract the access id
      val accessId = array(1).toString.split("=")(1).trim
      // Extract the secret key
      val secretKey = array(2).toString.split("=")(1).trim
      (accessId, secretKey)
    } catch {
      case e: Exception => {
        e.printStackTrace()
        System.exit(1)
      }
    }
  }

  // Set the command line arguments
  def parseCommandLineArgs(args: Array[String]): Unit = {
    try {
      followers = args(0)
      people = args(1)
      output = args(2)
    } catch {
      case e: Exception => {
        e.printStackTrace()
        System.exit(1)
      }
    }

    if (args.length > 3) resetProb = args(3).toDouble
    if (args.length > 4) tol = args(4).toDouble
  }
}
