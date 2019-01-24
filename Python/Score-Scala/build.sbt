name := "NIS-Score-Scala"

version := "0.1"

scalaVersion := "2.11.11"

libraryDependencies ++=Seq(
  "org.apache.spark" % "spark-core_2.11" % "2.2.0" % "provided",
  "org.apache.spark" % "spark-sql_2.11" % "2.2.0" % "provided",
  "org.apache.spark" % "spark-streaming_2.11" % "2.2.0" % "provided",
  "org.apache.spark" % "spark-mllib_2.11" % "2.2.0" % "provided",
  "org.apache.spark" % "spark-graphx_2.11" % "2.2.0" % "provided"
)
        