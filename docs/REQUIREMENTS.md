### Requirements

######  There is not a fixed set of hardware requirements to use this library, as it is only a library, and requirements depend on the application that will be using it.  Our production deployment is running an application that is using the classes provided to extract and write block data with no concurrency.  The application is running in a container with a hard memory limit of 500MB on a t4g.xlarge (aws), sharing it with approximately 12 different production apps. 

##### Dependencies:

Aside from hardware, which is minimal, the only other requirements are the following dependencies:

* Node v12.x, 14.x, 16.x
* NPM (versions compatible with above Node versions)
* PostgreSQL
